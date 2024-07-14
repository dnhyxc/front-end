### 前言

为了方便自己的前后台项目的部署，而无需每次都通过 xshell 或者其他工具来手动上传文件，过程相对复杂，且容易出错。因此决定自己开发一个自动化部署工具。同时为了方便之后每个项目都能方便的使用，而不是将这个项目上实现的部署代码拷贝到另一个项目上使用，所以需要将该项目作为脚手架的形式做成一个 npm 包，方便其他项目使用。

### 自动化部署方案

当今市面上自动部署的方案有 Jenkins、GitLab 等等。其中 Jenkins 适合需要高度定制和复杂集成的场景，而 GitLab 则适合希望在一个平台上完成整个开发、测试和部署流程的团队。

而我们项目，只需要将前端代码，即 `dist` 文件，丢到 nginx 上，同时将服务代码丢到服务器上就行了，因此不需要搞一套复杂的发布流程，因此决定选择使用以 `node-ssh` 这个库为基础，实现自动化部署。

### 什么是 node-ssh

[node-ssh](https://www.npmjs.com/package/node-ssh) 是一个基于 Node.js 的模块，它提供了通过 SSH 连接到远程服务器并执行命令的功能。这使得我们可以在 Node.js 环境下轻松地实现对远程服务器的操作，如文件传输、命令执行等。

### 基于 node-ssh 实现自动化部署的流程

#### 收集服务器信息

通过 commander 来解析命令行参数：

```js
#!/usr/bin/env node

import { program } from 'commander'; // 解析命令行参
import chalk from 'chalk'; // 终端标题美化
import { updateVersion } from '@ci/utils';
import { publish, Options } from '@ci/publish';
import pkg from './package.json';

program.version(updateVersion(pkg.version), '-v, --version');

program
  .name('dnhyxc-ci')
  .description('自动部署工具')
  .usage('<command> [options]')
  .on('--help', () => {
    console.log(`\r\nRun ${chalk.cyan('dnhyxc-ci <command> --help')} for detailed usage of given command\r\n`);
  });

const publishCallback = async (name: string, options: Options) => {
  await publish(name, options);
};

program
  .command('publish <name>')
  .description('项目部署')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .option('-l, --lcalFilePath [lcalFilePath]', '输入本地文件路径')
  .option('-r, --remoteFilePath [remoteFilePath]', '输入服务器目标文件路径')
  .option('-i, --install', '是否需要安装依赖')
  .action(publishCallback);

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);
```

通过 `require` 导入用户需要发布的项目根目录下的 `publish.config.js` 中的发布配置，如果没有配置，那么就需要用户手动输入配置信息，这样可能会增加用户的操作复杂度，同时容错率也会降低，因此建议提前在项目根目录下配置好：

```js
const getPublishConfig = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(`${process.cwd()}/publish.config.js`);
    return config;
  } catch (error) {
    console.log(
      beautyLog.warning,
      chalk.yellowBright('当前项目根目录下未配置 publish.config.js 文件，需要手动输入配置信息')
    );
    return null;
  }
};
```

`publish.config.js` 发布配置示例：

```js
module.exports = {
  // 服务器配置
  serverInfo: {
    // 目标服务器IP
    host: '106.69.29.11',
    // 目标服务器用户名
    username: 'root',
    // 端口号
    port: 22
  },
  // 项目配置
  porjectInfo: {
    // 前台项目1配置
    dnhyxc: {
      name: 'dnhyxc',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/dnhyxc',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/dnhyxc',
      // 标识是否是服务端项目
      isServer: false
    },
    // 前台项目2配置
    blogClientWeb: {
      name: 'html',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-client-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/html',
      // 标识是否是服务端项目
      isServer: false
    },
    blogAdminWeb: {
      name: 'admin_html',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-admin-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/html_admin',
      // 标识是否是服务端项目
      isServer: false
    },
    blogServerWeb: {
      name: 'server',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-server-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/server',
      // 标识是否是服务端项目
      isServer: true
    }
  }
};
```

通过 prompts 收集用户输入的服务器地址、用户名、密码等信息：

```js
import path from 'node:path';
import prompts from 'prompts';
import archiver from 'archiver';
import chalk from 'chalk';
import ora from 'ora';
import { NodeSSH } from 'node-ssh';
import { beautyLog } from './utils';

export interface Options {
  host: string;
  port: string;
  username: string;
  password: string;
  localFilePath: string;
  remoteFilePath: string;
  install: boolean;
  isServer: boolean;
}

let result: Partial<Options> = {};

const ssh = new NodeSSH();

export const publish = async (projectName: string, options: Options) => {
  const {
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    localFilePath: _localFilePath,
    remoteFilePath: _remoteFilePath,
    install: _install
  } = options;

  // 读取发布项目根目录下的发布配置
  const publishConfig = getPublishConfig();

  const getRemoteFilePath = () => {
    if (publishConfig?.porjectInfo[projectName]) {
      return publishConfig?.porjectInfo[projectName]?.remoteFilePath;
    } else {
      return '';
    }
  };

  const getInstallStatus = (isServer: boolean) => {
    return !!(_install || (publishConfig ? !publishConfig?.porjectInfo[projectName]?.isServer : !isServer));
  };

  try {
    result = await prompts(
      [
        {
          name: 'host',
          type: _host || publishConfig ? null : 'text',
          message: 'host:',
          initial: publishConfig?.serverInfo?.host || '',
          validate: (value) => (value ? true : '请输入host')
        },
        {
          name: 'port',
          type: _port || publishConfig ? null : 'text',
          message: '端口号:',
          initial: publishConfig?.serverInfo?.port || '',
          validate: (value) => (value ? true : '请输入端口号')
        },
        {
          name: 'localFilePath',
          type: _localFilePath || publishConfig ? null : 'text',
          message: '本地项目文件路径:',
          initial: process.cwd(),
          validate: (value) => (value ? true : '请输入本地项目文件路径')
        },
        {
          name: 'remoteFilePath',
          type: _remoteFilePath || publishConfig ? null : 'text',
          message: '目标服务器项目文件路径:',
          initial: getRemoteFilePath() || '',
          validate: (value) => (value ? true : '请输入目标服务器项目文件路径')
        },
        {
          name: 'isServer',
          type: _install || getRemoteFilePath() ? null : 'toggle',
          message: '是否是后台服务:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'install',
          type: (_, values) => (getInstallStatus(values.isServer) ? null : 'toggle'),
          message: '是否安装依赖:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'username',
          type: _username || publishConfig ? null : 'text',
          message: '用户名称:',
          initial: publishConfig?.serverInfo?.username || '',
          validate: (value) => (value ? true : '请输入用户名称')
        },
        {
          name: 'password',
          type: _password ? null : 'password',
          message: '密码:',
          validate: (value) => (value ? true : '请输入密码')
        }
      ],
      {
        onCancel: () => {
          throw new Error('User cancelled');
        }
      }
    );
  } catch (cancelled) {
    process.exit(1);
  }

  const { host, port, username, password, localFilePath, remoteFilePath, install } = result;

  await onPublish({
    host: host || publishConfig?.serverInfo?.host || _host,
    port: port || publishConfig?.serverInfo?.port || _port,
    username: username || publishConfig?.serverInfo?.username || _username,
    password: password || _password,
    localFilePath: localFilePath || process.cwd() || _localFilePath,
    remoteFilePath: remoteFilePath || getRemoteFilePath() || _remoteFilePath,
    install: install || _install,
    projectName,
    publishConfig
  });
};
```

#### 连接服务器

收集到信息之后，通过 node-ssh 连接到远程服务器，具体实现方式如下：

```js
const onConnectServer = async ({
  host,
  port,
  username,
  password
}: Pick<Options, 'host' | 'port' | 'username' | 'password'>) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan(`正在连接服务器: ${username}@${host}:${port} ...`))
  }).start();
  try {
    // 连接到服务器
    await ssh.connect({
      host,
      username,
      port,
      password,
      tryKeyboard: true
    });
    spinner.succeed(chalk.greenBright('服务器连接成功!!!'));
  } catch (err) {
    spinner.fail(chalk.redBright(`服务器连接失败: ${err}`));
    process.exit(1);
  }
};
```

#### 压缩文件

服务器连接成功之后，再通过 `archiver` 插件实现对本地项目打包好的 `dist` 文件进行压缩。以便上传到服务器上。其中需要区分是前台项目还是后台 node 服务端项目，前台只需要将项目打包出的 dist 文件进行打包即可，而后台项目是将项目目录下的 src、package.json 等文件打包成一个压缩包，然后上传到服务器上。具体实现如下：

- 打包前台项目：

```js
// localFilePath：本地项目的文件路径 /Users/dnhyxc/Documents/code/blog-client-web
const onCompressFile = async (localFilePath: string) => {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: chalk.yellowBright(`正在压缩文件: ${chalk.cyan(`${localFilePath}/dist`)}`)
    }).start();
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err: Error) => {
      console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
    });
    const output = fs.createWriteStream(`${localFilePath}/dist.zip`);
    output.on('close', (err: Error) => {
      if (err) {
        spinner.fail(chalk.redBright(`压缩文件: ${chalk.cyan(`${localFilePath}/dist`)} 失败`));
        console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
        reject(err);
        process.exit(1);
      }
      spinner.succeed(chalk.greenBright(`压缩文件: ${chalk.cyan(`${localFilePath}/dist`)} 成功`));
      resolve(1);
    });
    archive.pipe(output);
    // 第二参数表示在压缩包中创建 dist 目录，将压缩内容放在 dist 目录下，而不是散列到压缩包的根目录
    archive.directory(`${localFilePath}/dist`, '/dist');
    archive.finalize();
  });
};
```

- 压缩后台服务项目：

```js
// localFilePath：本地项目的文件路径 /Users/dnhyxc/Documents/code/blog-client-web
const onCompressServiceFile = async (localFilePath: string) => {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: chalk.yellowBright(`正在压缩文件: ${chalk.cyan(`${localFilePath}/dist`)}`)
    }).start();
    const srcPath = `${localFilePath}/src`;
    const uploadPath = `${srcPath}/upload`;
    const tempUploadPath = `${localFilePath}/upload`;
    fs.moveSync(uploadPath, tempUploadPath, { overwrite: true });
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err: Error) => {
      console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
    });
    const output = fs.createWriteStream(`${localFilePath}/dist.zip`);
    output.on('close', (err: Error) => {
      if (!err) {
        fs.moveSync(tempUploadPath, uploadPath, { overwrite: true });
        spinner.succeed(chalk.greenBright(`压缩文件: ${chalk.cyan(`${localFilePath}/src`)} 等文件成功`));
        resolve(1);
      } else {
        spinner.fail(chalk.redBright(`压缩文件: ${chalk.cyan(`${localFilePath}/src`)} 等文件失败`));
        console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
        reject(err);
        process.exit(1);
      }
    });
    archive.pipe(output);
    archive.directory(`${localFilePath}/src`, '/src');
    archive.file(path.join(localFilePath, 'package.json'), { name: 'package.json' });
    archive.file(path.join(localFilePath, 'yarn.lock'), { name: 'yarn.lock' });
    archive.finalize();
  });
};
```

#### 上传文件

文件打包完成之后，再通过 `node-ssh` 上传打包好的文件到远程服务器的指定目录。

```js
// localFilePath：本地项目的文件路径 /Users/dnhyxc/Documents/code/blog-client-web
// remoteFilePath：远程服务器上的项目路径 /usr/local/nginx/html
const onPutFile = async (localFilePath: string, remoteFilePath: string) => {
  try {
    // 通过 cliProgress 显示上传进度条
    const progressBar = new cliProgress.SingleBar({
      format: '文件上传中: {bar} | {percentage}% | ETA: {eta}s | {value}MB / {total}MB',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    const localFile = path.resolve(__dirname, `${localFilePath}/dist.zip`);
    const remotePath = path.join(remoteFilePath, path.basename(localFile));
    const stats = fs.statSync(localFile);
    const fileSize = stats.size;
    progressBar.start(Math.ceil(fileSize / 1024 / 1024), 0);
    // 上传文件
    await ssh.putFile(localFile, remotePath, null, {
      concurrency: 10, // 控制上传的并发数
      chunkSize: 16384, // 指定每个数据块的大小，适应慢速连接 16kb
      step: (totalTransferred: number) => {
        progressBar.update(Math.ceil(totalTransferred / 1024 / 1024));
      }
    });
    progressBar.stop();
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`上传文件失败: ${error}`));
    process.exit(1);
  }
};
```

#### 删除服务器上的 dist 文件

当文件上传完毕之后，删除服务器指定目录上的 `dist` 文件，以便解压服务器上刚上传的 `dist.zip` 文件。

```js
// localFile：本地项目的 dist 文件路径 /Users/dnhyxc/Documents/code/blog-client-web/dist
const onDeleteFile = async (localFile: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在删除文件: ${chalk.cyan(localFile)}`)
  }).start();
  try {
    await ssh.execCommand(`rm -rf ${localFile}`);
    spinner.succeed(chalk.greenBright(`删除文件: ${chalk.cyan(`${localFile}`)} 成功`));
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`Failed to delete dist folder: ${err}`));
    spinner.fail(chalk.redBright(`删除文件: ${chalk.cyan(`${localFile}`)} 失败`));
    process.exit(1);
  }
};
```

#### 解压服务器上刚上传的 dist.zip 文件

当文件上传成功之后，解压服务器上刚上传的 `dist.zip` 文件到指定的目录下，解压完成之后，删除服务器上的 `dist.zip` 文件。

```js
// remotePath：远程服务器上的项目路径 /usr/local/server
const onUnzipZip = async (remotePath: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)}`)
  }).start();
  try {
    await ssh.execCommand(`unzip -o ${`${remotePath}/dist.zip`} -d ${remotePath}`);
    spinner.succeed(chalk.greenBright(`解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 成功`));
    await onDeleteFile(`${remotePath}/dist.zip`);
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`Failed to unzip dist.zip: ${err}`));
    spinner.fail(chalk.redBright(`解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 失败`));
    process.exit(1);
  }
};
```

#### 删除本地 dist.zip 文件

当文件解压成功之后，删除本地的 `dist.zip` 文件。

```js
const onRemoveFile = async (localFile: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在删除文件: ${chalk.cyan(localFile)}`)
  }).start();
  return new Promise((resolve, reject) => {
    try {
      const fullPath = path.resolve(localFile);
      // 删除文件
      fs.unlink(fullPath, (err) => {
        if (err === null) {
          spinner.succeed(chalk.greenBright(`删除文件: ${chalk.cyan(localFile)} 成功\n`));
          resolve(1);
        }
      });
    } catch (err) {
      console.error(chalk.red(`Failed to delete file ${localFile}: ${err}`));
      spinner.fail(chalk.redBright(`删除文件: ${chalk.cyan(localFile)} 失败`));
      reject(err);
      process.exit(1);
    }
  });
};
```

#### 服务端项目安装依赖

如果发布的是 node 服务端项目，需要根据收集到的用户输入信息，判断是否需要安装依赖，如果需要则需要通过方式安装。

```js
const onInstall = async (remotePath: string) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan('正在安装依赖...'))
  }).start();
  try {
    const { code, stdout, stderr } = await ssh.execCommand(`cd ${remotePath} && yarn install`);
    if (code === 0) {
      spinner.succeed(chalk.greenBright(`依赖安装成功: \n ${stdout} \n`));
    } else {
      spinner.fail(chalk.redBright(`依赖安装失败: ${stderr}`));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.redBright(`依赖安装失败: ${error}`));
    process.exit(1);
  }
};
```

#### 重启 node 服务

如果发布的是 node 服务端项目，在文件解压完成及依赖安装完成之后，需要重启 node 服务，以便让新发布的功能生效，此时我们可以利用 `node-ssh` 及服务器上的 `pm2` 实现对服务的重启。

```js
const onRestartServer = async (remotePath: string) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan('正在重启服务...'))
  }).start();
  try {
    const { code: deleteCode, stderr: deleteStderr } = await ssh.execCommand('pm2 delete 0');
    const { code: startCode, stderr: startStderr } = await ssh.execCommand(`pm2 start ${remotePath}/src/main.js`);
    const { code: listCode, stdout } = await ssh.execCommand('pm2 list');
    if (deleteCode === 0 && startCode === 0 && listCode === 0) {
      spinner.succeed(chalk.greenBright(`服务启动成功: \n ${stdout} \n`));
    } else {
      spinner.fail(chalk.redBright(`服务启动失败: ${deleteStderr || startStderr}`));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.redBright(`服务启动失败: ${error}`));
    process.exit(1);
  }
};
```

至此，如果控制台没有报错，那么就预示着项目已经成功发布了，此时就可以去浏览器上查看前台项目发布的内容是否生效了。

### index.ts 完整代码

```js
#!/usr/bin/env node

import { program } from 'commander'; // 解析命令行参
import chalk from 'chalk'; // 终端标题美化
import { updateVersion } from '@ci/utils';
import { publish, Options } from '@ci/publish';
import pkg from './package.json';

program.version(updateVersion(pkg.version), '-v, --version');

program
  .name('dnhyxc-ci')
  .description('自动部署工具')
  .usage('<command> [options]')
  .on('--help', () => {
    console.log(`\r\nRun ${chalk.cyan('dnhyxc-ci <command> --help')} for detailed usage of given command\r\n`);
  });

const publishCallback = async (name: string, options: Options) => {
  await publish(name, options);
};

program
  .command('publish <name>')
  .description('项目部署')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .option('-l, --lcalFilePath [lcalFilePath]', '输入本地文件路径')
  .option('-r, --remoteFilePath [remoteFilePath]', '输入服务器目标文件路径')
  .option('-i, --install', '是否需要安装依赖')
  .action(publishCallback);

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);
```

### publish.ts 完整代码

```js
import path from 'node:path';
import fs from 'fs-extra';
import { NodeSSH } from 'node-ssh';
import prompts from 'prompts';
import cliProgress from 'cli-progress';
import archiver from 'archiver';
import chalk from 'chalk';
import ora from 'ora';
import { beautyLog } from './utils';

export interface Options {
  host: string;
  port: string;
  username: string;
  password: string;
  localFilePath: string;
  remoteFilePath: string;
  install: boolean;
  isServer: boolean;
}

let result: Partial<Options> = {};

const ssh = new NodeSSH();

const getPublishConfig = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(`${process.cwd()}/publish.config.js`);
    return config;
  } catch (error) {
    console.log(
      beautyLog.warning,
      chalk.yellowBright('当前项目根目录下未配置 publish.config.js 文件，需要手动输入配置信息')
    );
    return null;
  }
};

// 压缩dist
const onCompressFile = async (localFilePath: string) => {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: chalk.yellowBright(`正在压缩文件: ${chalk.cyan(`${localFilePath}/dist`)}`)
    }).start();
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err: Error) => {
      console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
    });
    const output = fs.createWriteStream(`${localFilePath}/dist.zip`);
    output.on('close', (err: Error) => {
      if (err) {
        spinner.fail(chalk.redBright(`压缩文件: ${chalk.cyan(`${localFilePath}/dist`)} 失败`));
        console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
        reject(err);
        process.exit(1);
      }
      spinner.succeed(chalk.greenBright(`压缩文件: ${chalk.cyan(`${localFilePath}/dist`)} 成功`));
      resolve(1);
    });
    archive.pipe(output);
    // 第二参数表示在压缩包中创建 dist 目录，将压缩内容放在 dist 目录下，而不是散列到压缩包的根目录
    archive.directory(`${localFilePath}/dist`, '/dist');
    archive.finalize();
  });
};

// 压缩服务dist
const onCompressServiceFile = async (localFilePath: string) => {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: chalk.yellowBright(`正在压缩文件: ${chalk.cyan(`${localFilePath}/dist`)}`)
    }).start();
    const srcPath = `${localFilePath}/src`;
    const uploadPath = `${srcPath}/upload`;
    const tempUploadPath = `${localFilePath}/upload`;
    fs.moveSync(uploadPath, tempUploadPath, { overwrite: true });
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err: Error) => {
      console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
    });
    const output = fs.createWriteStream(`${localFilePath}/dist.zip`);
    output.on('close', (err: Error) => {
      if (!err) {
        fs.moveSync(tempUploadPath, uploadPath, { overwrite: true });
        spinner.succeed(chalk.greenBright(`压缩文件: ${chalk.cyan(`${localFilePath}/src`)} 等文件成功`));
        resolve(1);
      } else {
        spinner.fail(chalk.redBright(`压缩文件: ${chalk.cyan(`${localFilePath}/src`)} 等文件失败`));
        console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
        reject(err);
        process.exit(1);
      }
    });
    archive.pipe(output);
    archive.directory(`${localFilePath}/src`, '/src');
    archive.file(path.join(localFilePath, 'package.json'), { name: 'package.json' });
    archive.file(path.join(localFilePath, 'yarn.lock'), { name: 'yarn.lock' });
    archive.finalize();
  });
};

// 上传文件
const onPutFile = async (localFilePath: string, remoteFilePath: string) => {
  try {
    const progressBar = new cliProgress.SingleBar({
      format: '文件上传中: {bar} | {percentage}% | ETA: {eta}s | {value}MB / {total}MB',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    const localFile = path.resolve(__dirname, `${localFilePath}/dist.zip`);
    const remotePath = path.join(remoteFilePath, path.basename(localFile));
    const stats = fs.statSync(localFile);
    const fileSize = stats.size;
    progressBar.start(Math.ceil(fileSize / 1024 / 1024), 0);
    await ssh.putFile(localFile, remotePath, null, {
      concurrency: 10, // 控制上传的并发数
      chunkSize: 16384, // 指定每个数据块的大小，适应慢速连接 16kb
      step: (totalTransferred: number) => {
        progressBar.update(Math.ceil(totalTransferred / 1024 / 1024));
      }
    });
    progressBar.stop();
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`上传文件失败: ${error}`));
    process.exit(1);
  }
};

// 删除文件
const onDeleteFile = async (localFile: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在删除文件: ${chalk.cyan(localFile)}`)
  }).start();
  try {
    await ssh.execCommand(`rm -rf ${localFile}`);
    spinner.succeed(chalk.greenBright(`删除文件: ${chalk.cyan(`${localFile}`)} 成功`));
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`Failed to delete dist folder: ${err}`));
    spinner.fail(chalk.redBright(`删除文件: ${chalk.cyan(`${localFile}`)} 失败`));
    process.exit(1);
  }
};

// 删除本地文件
const onRemoveFile = async (localFile: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在删除文件: ${chalk.cyan(localFile)}`)
  }).start();
  return new Promise((resolve, reject) => {
    try {
      const fullPath = path.resolve(localFile);
      // 删除文件
      fs.unlink(fullPath, (err) => {
        if (err === null) {
          spinner.succeed(chalk.greenBright(`删除文件: ${chalk.cyan(localFile)} 成功\n`));
          resolve(1);
        }
      });
    } catch (err) {
      console.error(chalk.red(`Failed to delete file ${localFile}: ${err}`));
      spinner.fail(chalk.redBright(`删除文件: ${chalk.cyan(localFile)} 失败`));
      reject(err);
      process.exit(1);
    }
  });
};

// 解压文件
const onUnzipZip = async (remotePath: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)}`)
  }).start();
  try {
    await ssh.execCommand(`unzip -o ${`${remotePath}/dist.zip`} -d ${remotePath}`);
    spinner.succeed(chalk.greenBright(`解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 成功`));
    await onDeleteFile(`${remotePath}/dist.zip`);
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`Failed to unzip dist.zip: ${err}`));
    spinner.fail(chalk.redBright(`解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 失败`));
    process.exit(1);
  }
};

// 服务器安装依赖
const onInstall = async (remotePath: string) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan('正在安装依赖...'))
  }).start();
  try {
    const { code, stdout, stderr } = await ssh.execCommand(`cd ${remotePath} && yarn install`);
    if (code === 0) {
      spinner.succeed(chalk.greenBright(`依赖安装成功: \n ${stdout} \n`));
    } else {
      spinner.fail(chalk.redBright(`依赖安装失败: ${stderr}`));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.redBright(`依赖安装失败: ${error}`));
    process.exit(1);
  }
};

// 重启后台项目
const onRestartServer = async (remotePath: string) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan('正在重启服务...'))
  }).start();
  try {
    const { code: deleteCode, stderr: deleteStderr } = await ssh.execCommand('pm2 delete 0');
    const { code: startCode, stderr: startStderr } = await ssh.execCommand(`pm2 start ${remotePath}/src/main.js`);
    const { code: listCode, stdout } = await ssh.execCommand('pm2 list');
    if (deleteCode === 0 && startCode === 0 && listCode === 0) {
      spinner.succeed(chalk.greenBright(`服务启动成功: \n ${stdout} \n`));
    } else {
      spinner.fail(chalk.redBright(`服务启动失败: ${deleteStderr || startStderr}`));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.redBright(`服务启动失败: ${error}`));
    process.exit(1);
  }
};

// 连接服务器
const onConnectServer = async ({
  host,
  port,
  username,
  password
}: Pick<Options, 'host' | 'port' | 'username' | 'password'>) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan(`正在连接服务器: ${username}@${host}:${port} ...`))
  }).start();
  try {
    // 连接到服务器
    await ssh.connect({
      host,
      username,
      port,
      password,
      tryKeyboard: true
    });
    spinner.succeed(chalk.greenBright('服务器连接成功!!!'));
  } catch (err) {
    spinner.fail(chalk.redBright(`服务器连接失败: ${err}`));
    process.exit(1);
  }
};

// 连接服务器并上传文件
const onPublish = async ({
  username,
  host,
  port,
  password,
  localFilePath,
  remoteFilePath,
  projectName,
  install,
  publishConfig
}: Omit<Options, 'isServer'> & { projectName: string; publishConfig: { porjectInfo: any; projectInfo: any } }) => {
  try {
    await onConnectServer({
      host,
      username,
      port,
      password
    });
    // 判断是否是服务端项目
    if (publishConfig?.porjectInfo[projectName]?.isServer) {
      await onCompressServiceFile(localFilePath);
    } else {
      await onCompressFile(localFilePath);
    }
    await onPutFile(localFilePath, remoteFilePath);
    await onDeleteFile(`${remoteFilePath}/dist`);
    await onUnzipZip(remoteFilePath);
    await onRemoveFile(`${localFilePath}/dist.zip`);
    if (install) {
      await onInstall(remoteFilePath);
    }
    if (publishConfig?.porjectInfo[projectName]?.isServer) {
      await onRestartServer(remoteFilePath);
    }
    console.log(
      beautyLog.success,
      chalk.greenBright(chalk.bgCyan(` 🎉 🎉 🎉 ${projectName} 项目部署成功!!! 🎉 🎉 🎉 \n`))
    );
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`部署失败: ${err}`));
  } finally {
    // 关闭 SSH 连接
    ssh.dispose();
  }
};

export const publish = async (projectName: string, options: Options) => {
  const {
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    localFilePath: _localFilePath,
    remoteFilePath: _remoteFilePath,
    install: _install
  } = options;

  const publishConfig = getPublishConfig();

  const getRemoteFilePath = () => {
    if (publishConfig?.porjectInfo[projectName]) {
      return publishConfig?.porjectInfo[projectName]?.remoteFilePath;
    } else {
      // console.log(beautyLog.warning, chalk.yellowBright(`未找到项目 ${projectName} 的配置信息`));
      return '';
    }
  };

  const getInstallStatus = (isServer: boolean) => {
    return !!(_install || (publishConfig ? !publishConfig?.porjectInfo[projectName]?.isServer : !isServer));
  };

  try {
    result = await prompts(
      [
        {
          name: 'host',
          type: _host ? null : 'text',
          message: 'host:',
          initial: publishConfig?.serverInfo?.host || '',
          validate: (value) => (value ? true : '请输入host')
        },
        {
          name: 'port',
          type: _port ? null : 'text',
          message: '端口号:',
          initial: publishConfig?.serverInfo?.port || '',
          validate: (value) => (value ? true : '请输入端口号')
        },
        {
          name: 'localFilePath',
          type: _localFilePath ? null : 'text',
          message: '本地项目文件路径:',
          initial: process.cwd(),
          validate: (value) => (value ? true : '请输入本地项目文件路径')
        },
        {
          name: 'remoteFilePath',
          type: _remoteFilePath ? null : 'text',
          message: '目标服务器项目文件路径:',
          initial: getRemoteFilePath() || '',
          validate: (value) => (value ? true : '请输入目标服务器项目文件路径')
        },
        {
          name: 'isServer',
          type: _install || getRemoteFilePath() ? null : 'toggle',
          message: '是否是后台服务:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'install',
          type: (_, values) => (getInstallStatus(values.isServer) ? null : 'toggle'),
          message: '是否安装依赖:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'username',
          type: _username ? null : 'text',
          message: '用户名称:',
          initial: publishConfig?.serverInfo?.username || '',
          validate: (value) => (value ? true : '请输入用户名称')
        },
        {
          name: 'password',
          type: _password ? null : 'password',
          message: '密码:',
          validate: (value) => (value ? true : '请输入密码')
        }
      ],
      {
        onCancel: () => {
          throw new Error('User cancelled');
        }
      }
    );
  } catch (cancelled) {
    process.exit(1);
  }

  const { host, port, username, password, localFilePath, remoteFilePath, install } = result;

  await onPublish({
    host: host || _host,
    port: port || _port,
    username: username || _username,
    password: password || _password,
    localFilePath: localFilePath || _localFilePath,
    remoteFilePath: remoteFilePath || _remoteFilePath,
    install: install || _install,
    projectName,
    publishConfig
  });
};
```

### 项目源码

当前工具项目源码可在 github 上查看 [dnhyxc-tools/packages/ci](https://github.com/dnhyxc/dnhyxc-tools/tree/master/packages/ci)

### 总结

本文主要介绍了发布前台项目及后台 node 服务端项目的流程，主要涉及到收集用户输入信息、连接服务器、压缩文件、上传文件、删除服务器上的 dist 文件、解压服务器上刚上传的 dist.zip 文件、删除本地 dist.zip 文件、服务端项目安装依赖、重启 node 服务等步骤。通过这些步骤，实现了一个在项目打包之后可直接自动发布的工具。
