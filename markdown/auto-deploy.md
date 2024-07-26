## 前言

为了方便自己的前后台项目的部署，而无需每次都通过 xshell 或者其他工具来手动上传文件，过程相对复杂，且容易出错。因此决定自己开发一个自动化部署工具。同时为了方便之后每个项目都能方便的使用，而不是将这个项目上实现的部署代码拷贝到另一个项目上使用，所以需要将该项目作为脚手架的形式做成一个 npm 包，方便其他项目使用。

## 自动化部署方案

当今市面上自动部署的方案有 Jenkins、GitLab 等等。其中 Jenkins 适合需要高度定制和复杂集成的场景，而 GitLab 则适合希望在一个平台上完成整个开发、测试和部署流程的团队。

而我们项目，只需要将前端代码，即 `dist` 文件，丢到 nginx 上，同时将服务代码丢到服务器上就行了，因此不需要搞一套复杂的发布流程，因此决定选择使用以 `node-ssh` 这个库为基础，实现自动化部署。

## 什么是 node-ssh

[node-ssh](https://www.npmjs.com/package/node-ssh) 是一个基于 Node.js 的模块，它提供了通过 SSH 连接到远程服务器并执行命令的功能。这使得我们可以在 Node.js 环境下轻松地实现对远程服务器的操作，如文件传输、命令执行等。

## 基于 node-ssh 连接服务器及操作服务器资源

### 建立 SSH 连接

```js
const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();

const config = {
	host: "remote-server-ip",
	username: "your-username",
	password: "your-password",
};

ssh
	.connect(config)
	.then(() => {
		console.log("SSH 连接成功");
		// 连接成功后可以执行远程命令或文件操作
	})
	.catch((err) => {
		console.error("SSH 连接失败", err);
	});
```

### 执行远程命令

```js
ssh
	.execCommand("pm2 delete 0")
	.then((result) => {
		console.log("命令输出：", result.stdout);
	})
	.catch((err) => {
		console.error("命令执行失败", err);
	});
```

### 上传文件到远程服务器

```js
ssh
	.putFile("本地文件路径", "需要上传到服务器的路径")
	.then(() => {
		console.log("文件上传成功");
	})
	.catch((err) => {
		console.error("文件上传失败", err);
	});
```

### 下载文件到本地

```js
ssh
	.getFile("remote-path/to/file", "local-path/to/save")
	.then(() => {
		console.log("文件下载成功");
	})
	.catch((err) => {
		console.error("文件下载失败", err);
	});
```

### 读取远程文件内容到本地

```js
ssh
	.execCommand("cat 服务器文件路径")
	.then((result) => {
		console.log("文件内容:", result.stdout);
	})
	.catch((err) => {
		console.error("执行 cat 命令时出错:", err);
	});
```

### 关闭 SSH 连接

```js
ssh
	.dispose()
	.then(() => {
		console.log("SSH 连接关闭");
	})
	.catch((err) => {
		console.error("关闭 SSH 连接时出错", err);
	});
```

## 实现自动化部署具体流程

### 自动化部署实现流程图

![自动部署实现流程图.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/20b4860440534ae2a1914d1196fe2f08~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiNDI2NTc2MDg0ODg4NTM2OCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722569275&x-orig-sign=8U6FLATq8x1tHbfBJDqIOfpjWDI%3D)

### 收集服务器及项目相关信息

#### 通过 commander 来解析命令行参数

用户可以通过 `dnhyxc-ci publish projectName` 命令行携带了 `-h`、`-p`、`-u`、`-m`、`-l`、`-r`、`-s`、`-i` 等参数，表明服务器的 host、端口号、用户名、密码、本地文件路径、远程文件路径、是否是服务端项目、是否需要安装依赖等信息。通过这些携带的参数可以减少用户的输入，提高用户的操作效率。如果没有携带这些参数，那么就需要用户手动输入相关信息。通过如下 prompts 进行收集。

```js
#!/usr/bin/env node

import { program } from "commander"; // 解析命令行参
import chalk from "chalk"; // 终端标题美化
import { updateVersion } from "@ci/utils";
import { publish, Options } from "@ci/publish";
import pkg from "./package.json";

program.version(updateVersion(pkg.version), "-v, --version");

program
	.name("dnhyxc-ci")
	.description("自动部署工具")
	.usage("<command> [options]")
	.on("--help", () => {
		console.log(
			`\r\nRun ${chalk.cyan(
				"dnhyxc-ci <command> --help"
			)} for detailed usage of given command\r\n`
		);
	});

const publishCallback = async (name: string, options: Options) => {
	await publish(name, options);
};

program
	.command("publish <name>")
	.description("项目部署")
	.option("-h, --host [host]", "输入host")
	.option("-p, --port [port]", "输入端口号")
	.option("-u, --username [username]", "输入用户名")
	.option("-m, --password [password]", "输入密码")
	.option(
		"-l, --localFilePath [localFilePath]",
		"输入本地文件路径，必须以 / 开头"
	)
	.option(
		"-r, --remoteFilePath [remoteFilePath]",
		"输入服务器目标文件路径，必须以 / 开头"
	)
	.option(
		"-s, --isServer [isServer]",
		"是否是 node 服务端项目，只允许输入 true 或 false"
	)
	.option("-i, --install", "是否需要安装依赖")
	.action((name, option) => {
		if (option?.localFilePath && !isValidFilePath(option?.localFilePath)) {
			console.log(`\n${chalk.redBright("Error: 本地文件路径必须以 / 开头")}\n`);
			process.exit(1);
		}
		if (option?.remoteFilePath && !isValidFilePath(option?.remoteFilePath)) {
			console.log(
				`\n${chalk.redBright("Error: 服务器目标文件路径必须以 / 开头")}\n`
			);
			process.exit(1);
		}
		if (option?.isServer && !["true", "false"].includes(option.isServer)) {
			console.log(
				`\n${chalk.redBright("Error: -s 只能携带 true 或 false，如 -s true")}\n`
			);
			process.exit(1);
		}
		publishCallback(name, option);
	});

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);
```

通过 `require` 导入用户需要发布的项目根目录下的 `publish.config.json` 中的发布配置，如果没有配置，那么就需要用户手动输入配置信息，这样可能会增加用户的操作复杂度，同时容错率也会降低，因此建议提前在项目根目录下配置好：

```js
export const getPublishConfig = () => {
  try {
    const config = JSON.parse(fs.readFileSync(`${ompatiblePath(process.cwd(), 'publish.config.json')}`, 'utf8'));
    return config;
  } catch (error) {
    console.log(beautyLog.warning, chalk.redBright(`未找到 ${chalk.cyan('publish.config.json')} 相关发布配置`));
    return null;
  }
};
```

`publish.config.json` 发布配置示例：

```js
{
  "serverInfo": {
    "host": "106.69.29.11",
    "username": "root",
    "port": "22"
  },
  "nginxInfo": {
    "remoteFilePath": "/usr/local/nginx/conf",
    "restartPath": "/usr/local/nginx/sbin"
  },
  "serviceInfo": {
    "restartPath": "/usr/local/server"
  },
  "dnhyxc": {
    "name": "dnhyxc",
    "localFilePath": "/Users/dnhyxc/Documents/code/dnhyxc",
    "remoteFilePath": "/usr/local/nginx/dnhyxc",
    "isServer": false
  },
  "example": {
    "name": "dnhyxc",
    "localFilePath": "/Users/dnhyxc/Documents/code/dnhyxc",
    "remoteFilePath": "/usr/local/nginx/dnhyxc",
    "isServer": false
  },
  "blogClientWeb": {
    "name": "html",
    "localFilePath": "/Users/dnhyxc/Documents/code/blog-client-web",
    "remoteFilePath": "/usr/local/nginx/html",
    "isServer": false
  },
  "blogAdminWeb": {
    "name": "admin_html",
    "localFilePath": "/Users/dnhyxc/Documents/code/blog-admin-web",
    "remoteFilePath": "/usr/local/nginx/html_admin",
    "isServer": false
  },
  "blogServerWeb": {
    "name": "server",
    "localFilePath": "/Users/dnhyxc/Documents/code/blog-server-web",
    "remoteFilePath": "/usr/local/server",
    "isServer": true
  }
}
```

#### 通过 prompts 收集用户输入的服务器地址、用户名、密码等信息

当用户在需要发布的项目根目录下配置了 `publish.config.json` 文件时，用户只需要输入密码连接服务器后，就能直接发布项目了，如果没有配置，或者携带相关的的参数，那么对应的参数就需要用户通过 prompts 手动输入，在收集到用户输入的信息之后，才能完成发布，这种方式相对繁琐，因此，建议提前在项目根目录下配置好发布项目相关的配置。

```js
import prompts from "prompts";
import chalk from "chalk";
import { beautyLog } from "./utils";

export const publish = async (projectName: string, options: Omit<Options, 'isServer'> & { isServer: string }) => {
  const {
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    localFilePath: _localFilePath,
    remoteFilePath: _remoteFilePath,
    install: _install,
    isServer: _isServer
  } = options;

  // 标识是否已经校验
  let isVerified = false;

  const publishConfig: PublishConfigParams = getPublishConfig();

  const isService = getPublishConfigInfo(publishConfig, projectName, 'isServer');

  const localPath =
    _localFilePath ||
    (getPublishConfigInfo(publishConfig, projectName, 'localFilePath') as string) ||
    `${process.cwd()}`;

  // 发布配置中 isServer 配置存在时，直接校验
  if (localPath && (isService !== undefined || _isServer !== undefined)) {
    onVerifyFile(localPath, _isServer === 'true' || !!isService);
    isVerified = true;
  }

  try {
    const verifyIsServer = (options: Options) => {
      /**
       * 判断是否输入了 isServer 选项，并且 isServer 选项的值为 true 时，则显示安装依赖选项
       * 判断是否携带 -i 参数，如果未携带，则显示安装依赖选项
       * 如果 publish.config.json 中配置了 isServer 为 true 时，则显示安装依赖选项
       */
      const needInstall = (_isServer === 'true' || options.isServer || isService) && _install === undefined;

      !isVerified &&
        onVerifyFile(
          _localFilePath ||
            options.localFilePath ||
            (getPublishConfigInfo(publishConfig, projectName, 'localFilePath') as string) ||
            process.cwd(),
          _isServer === 'true' || options.isServer || !!isService
        );

      return needInstall;
    };

    result = await prompts(
      [
        {
          name: 'host',
          type: _host || getPublishConfigInfo(publishConfig, 'serverInfo', 'host', true) ? null : 'text',
          message: 'host:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'host') || '',
          validate: (value) => (value ? true : '请输入host')
        },
        {
          name: 'port',
          type: _port || getPublishConfigInfo(publishConfig, 'serverInfo', 'port', true) ? null : 'text',
          message: '端口号:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'port') || '',
          validate: (value) => (value ? true : '请输入端口号')
        },
        {
          name: 'localFilePath',
          type:
            _localFilePath || getPublishConfigInfo(publishConfig, projectName, 'localFilePath', true) ? null : 'text',
          message: '本地项目文件路径:',
          initial: process.cwd(),
          validate: (value) => (value ? true : '请输入本地项目文件路径')
        },
        {
          name: 'remoteFilePath',
          type:
            _remoteFilePath || getPublishConfigInfo(publishConfig, projectName, 'remoteFilePath', true) ? null : 'text',
          message: '目标服务器项目文件路径:',
          initial: getPublishConfigInfo(publishConfig, projectName, 'remoteFilePath') || '',
          validate: (value) => (value ? true : '请输入目标服务器项目文件路径')
        },
        {
          name: 'isServer',
          type:
            _isServer !== undefined ||
            _install ||
            getPublishConfigInfo(publishConfig, projectName, 'isServer', true) !== undefined
              ? null
              : 'toggle',
          message: '是否是后台服务:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'install',
          type: (_, values) => {
            // isServer 为 true 时，或者 publish.config.json 中没有配置 isServer 为 true 时，或者 _install 没有传入了值时，才显示安装依赖选项
            return !verifyIsServer(values) ? null : 'toggle';
          },
          message: '是否安装依赖:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'username',
          type: _username || getPublishConfigInfo(publishConfig, 'serverInfo', 'username', true) ? null : 'text',
          message: '用户名称:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'username') || '',
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
          console.log(`\n${beautyLog.error}`, chalk.red('已取消输入配置信息\n'));
          process.exit(1);
        }
      }
    );
  } catch (err) {
    console.log(`\n${beautyLog.error}`, `${chalk.red('请检查 publish.config.json 发布配置或者输入信息是否有误!')}\n`);
    console.log(beautyLog.error, chalk.red(`${err}!\n`));
    process.exit(1);
  }

  const { host, port, username, password, localFilePath, remoteFilePath, install, isServer } = result;

  await onPublish({
    host: host || _host || (getPublishConfigInfo(publishConfig, 'serverInfo', 'host') as string),
    port: port || _port || (getPublishConfigInfo(publishConfig, 'serverInfo', 'port') as string),
    username: username || _username || (getPublishConfigInfo(publishConfig, 'serverInfo', 'username') as string),
    password: password || _password,
    localFilePath:
      localFilePath ||
      _localFilePath ||
      (getPublishConfigInfo(publishConfig, projectName, 'localFilePath') as string) ||
      process.cwd(),
    remoteFilePath:
      remoteFilePath ||
      _remoteFilePath ||
      (getPublishConfigInfo(publishConfig, projectName, 'remoteFilePath') as string),
    install: install || _install,
    isServer: _isServer ? _isServer === 'true' : isServer || !!isService
  });
};
```

### 连接服务器

通过 `node-ssh` 实现服务器的连接，并在连接成功后，执行相关的命令或操作。具体实现如下：

```js
export const onConnectServer = async ({
	host,
	port,
	username,
	password,
	ssh,
}: Pick<Options, "host" | "port" | "username" | "password"> & {
	ssh: NodeSSH,
}) => {
	const spinner = ora({
		text: chalk.yellowBright(
			chalk.cyan(`正在连接服务器: ${username}@${host}:${port} ...`)
		),
	}).start();
	try {
		// 连接到服务器
		await ssh.connect({
			host,
			username,
			port,
			password,
			tryKeyboard: true,
		});
		spinner.succeed(chalk.greenBright("服务器连接成功!!!"));
	} catch (err) {
		spinner.fail(chalk.redBright(`服务器连接失败: ${err}`));
		process.exit(1);
	}
};
```

### 压缩本地文件

服务器连接成功之后，再通过 `archiver` 插件实现对本地项目打包好的 `dist` 文件进行压缩。以便上传到服务器上。其中需要区分是前台项目还是后台 node 服务端项目，前台只需要将项目打包出的 dist 文件进行打包即可，而后台项目是将项目目录下的 src、package.json 等文件打包成一个压缩包，然后上传到服务器上。具体实现如下：

- 打包前台项目：

```js
// localFilePath：本地项目的文件路径 /Users/dnhyxc/Documents/code/blog-client-web
const onCompressFile = async (localFilePath: string) => {
	return new Promise((resolve, reject) => {
		const spinner = ora({
			text: chalk.yellowBright(
				`正在压缩本地文件: ${chalk.cyan(
					ompatiblePath(localFilePath, "dist")
				)} ...`
			),
		}).start();
		const archive = archiver("zip", {
			zlib: { level: 9 },
		}).on("error", (err: Error) => {
			console.log(beautyLog.error, chalk.red(`压缩本地文件失败: ${err}`));
		});
		const output = fs.createWriteStream(
			ompatiblePath(localFilePath, "dist.zip")
		);
		output.on("close", (err: Error) => {
			if (err) {
				spinner.fail(
					chalk.redBright(
						`压缩文件: ${chalk.cyan(ompatiblePath(localFilePath, "dist"))} 失败`
					)
				);
				console.log(beautyLog.error, chalk.red(`压缩本地文件失败: ${err}`));
				reject(err);
				process.exit(1);
			}
			spinner.succeed(
				chalk.greenBright(
					`压缩本地文件: ${chalk.cyan(
						ompatiblePath(localFilePath, "dist")
					)} 成功`
				)
			);
			resolve(1);
		});
		archive.pipe(output);
		// 第二参数表示在压缩包中创建 dist 目录，将压缩内容放在 dist 目录下，而不是散列到压缩包的根目录
		archive.directory(ompatiblePath(localFilePath, "dist"), "/dist");
		archive.finalize();
	});
};
```

- 压缩后台服务项目：

```js
// localFilePath：本地项目的文件路径 /Users/dnhyxc/Documents/code/blog-client-web
const onPutFile = async (localFilePath: string, remoteFilePath: string) => {
	try {
		const progressBar = new cliProgress.SingleBar({
			format:
				"文件上传中: {bar} | {percentage}% | ETA: {eta}s | {value}MB / {total}MB",
			barCompleteChar: "\u2588",
			barIncompleteChar: "\u2591",
			hideCursor: true,
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
			},
		});
		progressBar.stop();
	} catch (error) {
		console.log(beautyLog.error, chalk.red(`上传文件失败: ${error}`));
		process.exit(1);
	}
};
```

### 上传本地文件到服务器

文件压缩完成之后，再通过 `ssh.putFile` 上传打包好的文件到远程服务器的指定目录。

```js
// localFilePath：本地项目的文件路径 /Users/dnhyxc/Documents/code/blog-client-web
// remoteFilePath：远程服务器上的项目路径 /usr/local/nginx/html
const onPutFile = async (localFilePath: string, remoteFilePath: string) => {
	try {
		const progressBar = new cliProgress.SingleBar({
			format:
				"文件上传中: {bar} | {percentage}% | ETA: {eta}s | {value}MB / {total}MB",
			barCompleteChar: "\u2588",
			barIncompleteChar: "\u2591",
			hideCursor: true,
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
			},
		});
		progressBar.stop();
	} catch (error) {
		console.log(beautyLog.error, chalk.red(`上传文件失败: ${error}`));
		process.exit(1);
	}
};
```

### 删除服务器上的 dist 文件

当文件上传完毕之后，删除服务器指定目录上的 `dist` 文件，以便解压服务器上刚上传的 `dist.zip` 文件。

```js
// localFile：本地项目的 dist 文件路径 /Users/dnhyxc/Documents/code/blog-client-web/dist
const onDeleteFile = async (localFile: string) => {
	const spinner = ora({
		text: chalk.yellowBright(`正在删除服务器文件: ${chalk.cyan(localFile)}`),
	}).start();
	try {
		await ssh.execCommand(`rm -rf ${localFile}`);
		spinner.succeed(
			chalk.greenBright(`删除服务器文件:${chalk.cyan(`${localFile}`)} 成功`)
		);
	} catch (err) {
		spinner.fail(
			chalk.redBright(
				`删除服务器文件: ${chalk.cyan(`${localFile}`)} 失败，${err}`
			)
		);
		process.exit(1);
	}
};
```

### 解压服务器上刚上传的 dist.zip 文件

当文件上传成功之后，解压服务器上刚上传的 `dist.zip` 文件到指定的目录下，解压完成之后，删除服务器上的 `dist.zip` 文件。

```js
// remotePath：远程服务器上的项目路径 /usr/local/server
const onUnzipZip = async (remotePath: string, isServer: boolean) => {
	remotePath = ompatiblePath(remotePath);
	const spinner = ora({
		text: chalk.yellowBright(
			`正在解压服务器文件: ${chalk.cyan(`${remotePath}/dist.zip`)} ...`
		),
	}).start();
	try {
		await ssh.execCommand(
			`unzip -o ${`${remotePath}/dist.zip`} -d ${remotePath}`
		);
		spinner.succeed(
			chalk.greenBright(
				`解压服务器文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 成功`
			)
		);
		await onRemoveServerFile(`${remotePath}/dist.zip`, ssh);
		!isServer &&
			console.log(
				`\n${beautyLog.success}`,
				chalk.greenBright(
					`${chalk.bold(
						`🎉 🎉 🎉 前端资源部署成功: ${chalk.cyan(`${remotePath}`)} 🎉 🎉 🎉`
					)}\n`
				)
			);
	} catch (err) {
		console.log(beautyLog.error, chalk.red(`Failed to unzip dist.zip: ${err}`));
		spinner.fail(
			chalk.redBright(
				`解压服务器文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 失败`
			)
		);
		process.exit(1);
	}
};
```

如果发布的是前端资源，到这一步，如果控制台没有发现错误，那么说明前端资源已经发布成功了，就可以到浏览器验证资源是否生效了。如果是 node 服务端项目，则可能还需要经过下文中的依赖安装和服务重启等步骤。

### 删除本地 dist.zip 文件

当文件解压成功之后，删除本地的 `dist.zip` 文件，当然也可以不删除，看个人意愿。

```js
export const onRemoveFile = async (localFile: string) => {
	const fullPath = ompatiblePath(localFile);
	const spinner = ora({
		text: chalk.yellowBright(`正在删除本地文件: ${chalk.cyan(fullPath)} ...`),
	}).start();
	return new Promise((resolve) => {
		try {
			// 删除文件
			fs.unlink(fullPath, (err) => {
				if (err === null) {
					spinner.succeed(
						chalk.greenBright(`删除本地文件: ${chalk.cyan(fullPath)} 成功`)
					);
					resolve(1);
				}
			});
		} catch (err) {
			spinner.fail(
				chalk.redBright(`删除本地文件: ${chalk.cyan(fullPath)} 失败，${err}`)
			);
			process.exit(1);
		}
	});
};
```

### 服务端项目安装依赖

如果发布的是 node 服务端项目，需要根据收集到的信息，判断是否需要安装依赖，如果需要则需要通过如下方式进行安装。

```js
const onInstall = async (remotePath: string) => {
	remotePath = ompatiblePath(remotePath);
	const spinner = ora({
		text: chalk.yellowBright(chalk.cyan("正在安装依赖...")),
	}).start();
	try {
		const { code, stdout, stderr } = await ssh.execCommand(
			`cd ${remotePath} && yarn install`
		);
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

### 重启 node 服务

发布的是 node 服务端项目时，在文件解压完成及依赖安装完成之后，需要重启 node 服务，以便让新发布的功能生效，此时我们可以利用 `node-ssh` 及服务器上的 `pm2` 实现对服务的重启。

```js
export const onRestartServer = async (remotePath: string, ssh: NodeSSH) => {
	remotePath = ompatiblePath(remotePath);
	const spinner = ora({
		text: chalk.yellowBright(chalk.cyan("正在重启服务...")),
	}).start();
	try {
		const { code: deleteCode, stderr: deleteStderr } = await ssh.execCommand(
			"pm2 delete 0"
		);
		const { code: startCode, stderr: startStderr } = await ssh.execCommand(
			`pm2 start ${remotePath}/src/main.js`
		);
		const { code: listCode, stdout } = await ssh.execCommand("pm2 list");
		if (deleteCode === 0 && startCode === 0 && listCode === 0) {
			spinner.succeed(chalk.greenBright(`服务启动成功: \n${stdout}`));
			console.log(
				`\n${beautyLog.success}`,
				chalk.greenBright(
					`${chalk.bold(
						`🎉 🎉 🎉 node 服务重启成功: ${chalk.cyan(
							`${remotePath}`
						)}!!! 🎉 🎉 🎉 \n`
					)}`
				)
			);
		} else {
			spinner.fail(
				chalk.redBright(`服务启动失败: ${deleteStderr || startStderr}`)
			);
			process.exit(1);
		}
	} catch (error) {
		spinner.fail(chalk.redBright(`服务启动失败: ${error}`));
		process.exit(1);
	}
};
```

至此，如果控制台没有报错，那么就预示着项目已经成功发布了，此时就可以去浏览器上查看前台项目发布的内容是否生效了。

## 实现服务器 nginx 配置文件的修改和发布

在修改 nginx 配置文件时，每次都需要通过 xshell 连接服务器，或者其他方式连接服务器，然后修改配置文件，而且修改的时候也不太方便，同时不能像在编辑器中修改文件这么的简洁明了。因此，就利用 `node-ssh` 模块实现对 nginx 配置文件的修改和发布。

### 解析命令行参数

通过 `commander` 解析用户执行 `dnhyxc-ci pull` 时携带的参数，包括 `-h`、`-p`、`-u`、`-m`、`-ncp` 等，从而获取用户需要发布的服务器 host、端口、用户名、密码及远程 nginx 配置文件路径等相关信息。如果用户没有携带这些信息，则需要通过 prompts 进行交互式的输入。

```js
import { program } from "commander"; // 解析命令行参
import chalk from "chalk"; // 终端标题美化

const pullNginxConfCallback = async (
	name: string,
	option: Options & CollectInfoParams
) => {
	await pull(name, option);
};

program
	.command("pull [configName]")
	.description("获取 nginx.conf 配置文件到本地")
	.option("-h, --host [host]", "输入host")
	.option("-p, --port [port]", "输入端口号")
	.option("-u, --username [username]", "输入用户名")
	.option("-m, --password [password]", "输入密码")
	.option(
		"-ncp, --nginxRemoteFilePath [nginxRemoteFilePath]",
		"输入服务器 nginx.conf 文件路径，必须以 / 开头"
	)
	.action((configName, option) => {
		if (
			option?.nginxRemoteFilePath &&
			!isValidFilePath(option?.nginxRemoteFilePath)
		) {
			console.log(
				`\n${chalk.redBright("Error: nginx.conf 文件路径必须以 / 开头")}\n`
			);
			process.exit(1);
		}
		pullNginxConfCallback(configName, option);
	});

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);
```

### 通过 prompts 收集用户输入信息

如果用户在需要发布的项目根目录下的 `publish.config.json` 文件中配置了项目发布的相关信息，则只需要输入密码后就可完成 nginx.conf 文件的拉取操作，否则需要输入 host、端口、用户名、密码、远程 nginx 配置文件路径等相关信息。

```js
export const onCollectServerInfo = async ({
	host,
	port,
	username,
	password,
	projectName,
	publishConfig,
	command,
	nginxRemoteFilePath,
	nginxRestartPath,
	serviceRestartPath,
}: CollectInfoParams) => {
	try {
		return await prompts(
			[
				{
					name: "host",
					type:
						host ||
						getPublishConfigInfo(publishConfig, "serverInfo", "host", true)
							? null
							: "text",
					message: "host:",
					initial:
						getPublishConfigInfo(publishConfig, "serverInfo", "host") || "",
					validate: (value) => (value ? true : "请输入host"),
				},
				{
					name: "port",
					type:
						port ||
						getPublishConfigInfo(publishConfig, "serverInfo", "port", true)
							? null
							: "text",
					message: "端口号:",
					initial:
						getPublishConfigInfo(publishConfig, "serverInfo", "port") || "",
					validate: (value) => (value ? true : "请输入端口号"),
				},
				{
					name: "username",
					type:
						username ||
						getPublishConfigInfo(publishConfig, "serverInfo", "username", true)
							? null
							: "text",
					message: "用户名称:",
					initial:
						getPublishConfigInfo(publishConfig, "serverInfo", "username") || "",
					validate: (value) => (value ? true : "请输入用户名称"),
				},
				{
					name: "nginxRemoteFilePath",
					type:
						nginxRemoteFilePath ||
						getPublishConfigInfo(
							publishConfig,
							"nginxInfo",
							"remoteFilePath",
							projectName !== "node"
						) ||
						projectName === "node"
							? null
							: "text",
					message: "服务器 nginx.conf 文件路径:",
					initial:
						getPublishConfigInfo(
							publishConfig,
							"nginxInfo",
							"remoteFilePath"
						) || "",
					validate: (value) =>
						isValidFilePath(value)
							? true
							: "输入的服务器 nginx.conf 文件路径必须以 / 开头",
				},
				/**
				 * 当输入了 nginxRestartPath 时、
				 * 或配置文件中有 restartPath 时、
				 * 或前两者都没有，并且 command 为 pull 时、
				 * 或 projectName 等于 nodo 时，不显示 serviceRestartPath 字段
				 */
				{
					name: "nginxRestartPath",
					type:
						nginxRestartPath ||
						getPublishConfigInfo(
							publishConfig,
							"nginxInfo",
							"restartPath",
							(command !== "pull" && projectName === "nginx") ||
								command === "push" // 判断是否需要提示
						) ||
						(!nginxRestartPath &&
							!getPublishConfigInfo(
								publishConfig,
								"nginxInfo",
								"restartPath"
							) &&
							command === "pull") ||
						projectName === "node"
							? null
							: "text",
					message: "服务器 nginx 重启路径:",
					initial:
						getPublishConfigInfo(publishConfig, "nginxInfo", "restartPath") ||
						"",
					validate: (value) =>
						isValidFilePath(value)
							? true
							: "输入的服务器 nginx 重启路径必须以 / 开头",
				},
				/**
				 * 当输入了 serviceRestartPath 时、
				 * 或配置文件中有 restartPath 时、
				 * 或前两者都没有，并且 command 为 pull 及 push 时、
				 * 或 projectName 等于 nginx 时，不显示 serviceRestartPath 字段
				 */
				{
					name: "serviceRestartPath",
					type:
						serviceRestartPath ||
						getPublishConfigInfo(
							publishConfig,
							"serviceInfo",
							"restartPath",
							command === "restart" && projectName === "node" // 判断是否需要提示
						) ||
						(!serviceRestartPath &&
							!getPublishConfigInfo(
								publishConfig,
								"serviceInfo",
								"restartPath"
							) &&
							command !== "restart") ||
						projectName === "nginx"
							? null
							: "text",
					message: "服务器 node 重启路径:",
					initial:
						getPublishConfigInfo(publishConfig, "serviceInfo", "restartPath") ||
						"",
					validate: (value) =>
						isValidFilePath(value)
							? true
							: "输入的服务器 node 重启路径必须以 / 开头",
				},
				{
					name: "password",
					type: password ? null : "password",
					message: "密码:",
					initial: "",
					validate: (value) => (value ? true : "请输入密码"),
				},
			],
			{
				onCancel: () => {
					console.log(
						`\n${beautyLog.error}`,
						chalk.red("已取消输入配置信息\n")
					);
					process.exit(1);
				},
			}
		);
	} catch (err) {
		console.log(beautyLog.error, chalk.red(err));
		process.exit(1);
	}
};
```

### 将 nginx.conf 文件内容写入到本地

通过 `ssh.execCommand('cat 服务器 nginx.conf 文件路径')` 可以将服务器上的 nginx.conf 内容读取到，并写入到当前需要发布项目根目录下的 nginx.conf 文件中，以便与后续内容的修改，之后再重新发布到服务器上。nginx.conf 发布成功过后，该 nginx.conf 文件将会被删除。

```js
const onReadNginxConfig = async (remotePath: string, localFileName: string) => {
	remotePath = ompatiblePath(remotePath);
	localFileName = ompatiblePath(localFileName);
	const spinner = ora({
		text: chalk.yellowBright(
			`正在读取远程 ${chalk.cyan(`${remotePath}`)} 文件...`
		),
	}).start();
	try {
		const result = await ssh.execCommand(`cat ${remotePath}`);
		const nginxConfigContent = result.stdout;
		if (nginxConfigContent) {
			// 写入到本地文件
			await fs.writeFile(localFileName, nginxConfigContent);
			spinner.succeed(
				chalk.greenBright(
					`读取 nginx.conf 成功，内容已写入到本地 ${chalk.cyan(
						`${localFileName}`
					)} 文件中`
				)
			);
		} else {
			spinner.fail(
				chalk.redBright(
					`读取 nginx.conf 失败，远程文件 ${chalk.cyan(
						`${remotePath}`
					)} 内容为空`
				)
			);
			process.exit(1);
		}
	} catch (err) {
		spinner.fail(
			chalk.redBright(`读取: ${chalk.cyan(`${remotePath}`)} 文件失败，${err}`)
		);
	}
};
```

### 将本地 nginx.conf 文件内容上传到服务器

通过 `ssh.putFile` 将本地 nginx 配置内容上传到服务器的指定目录下。

```js
const onPutNginxConfig = async (
	localFilePath: string,
	remoteFilePath: string
) => {
	localFilePath = ompatiblePath(localFilePath);
	remoteFilePath = ompatiblePath(remoteFilePath);
	const spinner = ora({
		text: chalk.yellowBright("正在推送 nginx.conf 文件到远程服务器..."),
	}).start();
	try {
		// 推送本地文件到远程服务器
		await ssh.putFile(localFilePath, remoteFilePath);
		spinner.succeed(
			chalk.greenBright(
				`服务器 ${chalk.cyan(`${remoteFilePath}`)} 内容更新成功`
			)
		);
	} catch (error) {
		spinner.fail(chalk.redBright(`推送 nginx.conf 文件到服务器失败: ${error}`));
		process.exit(0);
	}
};
```

### 重启 nginx 服务

nginx 配置文件上传成功之后，为了使配置能够生效，就需要重启一下 nginx 服务，这可以通过 `ssh.execCommand('cd /usr/local/nginx/sbin && ./nginx -s reload')` 命令实现。如果你在服务器上设置了 nginx 的环境变量，即可直接通过 `ssh.execCommand('nginx -s reload')` 命令重启 nginx 服务。

```js
export const onRestartNginx = async (
	remoteFilePath: string,
	restartPath: string,
	ssh: NodeSSH
) => {
	await onCheckNginxConfig(remoteFilePath, restartPath, ssh);
	const spinner = ora({
		text: chalk.yellowBright("正在重启 nginx 服务..."),
	}).start();
	try {
		await ssh.execCommand(
			`cd ${ompatiblePath(restartPath)} && ./nginx -s reload`
		);
		spinner.succeed(
			chalk.greenBright(`nginx 服务已重启: ${ompatiblePath(restartPath)}`)
		);
		if (verifyFile(`${process.cwd()}/nginx.conf`)) {
			await onRemoveFile(`${process.cwd()}/nginx.conf`);
		}
		console.log(
			`\n${beautyLog.success}`,
			chalk.greenBright(
				`${chalk.bold(
					`🎉 🎉 🎉 nginx 服务重启成功 ${ompatiblePath(restartPath)} 🎉 🎉 🎉`
				)}\n`
			)
		);
	} catch (error) {
		spinner.fail(chalk.redBright(`重启 nginx 服务失败: ${error}`));
		process.exit(0);
	}
};
```

## 重启 nginx 及 node 服务

在某些情况下，我们希望能重启一下 nginx 服务，或者 node 服务，此时也可以通过 `node-ssh` 模块实现。

### 解析命令行参数

通过 `commander` 解析命令行参数，获得用户执行 `dnhyxc-ci restart` 时携带的参数，包括 `-h`、`-p`、`-u`、`-m`、`-ncp`、`-nrp`、`-srp` 等，从而获取用户需要重启的服务器 host、端口、用户名、密码、nginx 配置文件路径、nginx 重启路径、node 服务重启路径等相关信息。

```js
import { program } from "commander"; // 解析命令行参
import chalk from "chalk"; // 终端标题美

const restartCallback = async (
	name: string,
	option: Options & CollectInfoParams
) => {
	await restart(name, option);
};

program
	.command("restart <serviceName>")
	.description("重启 nginx 或者 node 服务")
	.option("-h, --host [host]", "输入host")
	.option("-p, --port [port]", "输入端口号")
	.option("-u, --username [username]", "输入用户名")
	.option("-m, --password [password]", "输入密码")
	.option(
		"-ncp, --nginxRemoteFilePath [nginxRemoteFilePath]",
		"输入服务器 nginx.conf 文件路径，必须以 / 开头"
	)
	.option(
		"-nrp, --nginxRestartPath [nginxRestartPath]",
		"输入服务器 nginx 重启路径，必须以 / 开头"
	)
	.option(
		"-srp, --serviceRestartPath [serviceRestartPath]",
		"输入服务器 node 重启路径，必须以 / 开头"
	)
	.action((serviceName, option) => {
		const validatedServiceName = validateServiceName(serviceName);
		if (
			option?.nginxRemoteFilePath &&
			!isValidFilePath(option?.nginxRemoteFilePath)
		) {
			console.log(
				`\n${chalk.redBright("Error: nginx.conf 文件路径必须以 / 开头")}\n`
			);
			process.exit(1);
		}
		if (
			option?.nginxRestartPath &&
			!isValidFilePath(option?.nginxRestartPath)
		) {
			console.log(
				`\n${chalk.redBright("Error: nginx 重启路径必须以 / 开头")}\n`
			);
			process.exit(1);
		}
		if (
			option?.serviceRestartPath &&
			!isValidFilePath(option?.serviceRestartPath)
		) {
			console.log(
				`\n${chalk.redBright("Error: node 重启路径必须以 / 开头")}\n`
			);
			process.exit(1);
		}
		restartCallback(validatedServiceName, option);
	});

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);
```

### 通过 prompts 收集用户输入信息

如果用户在需要发布的项目根目录下的 `publish.config.json` 文件中配置了项目发布的相关信息，则只需要输入密码后就可完成服务的重启操作，否则需要输入服务器 host、端口、用户名、密码、远程 nginx 配置文件路径、远程 nginx 重启路径、远程 node 服务重启路径等相关信息。至于 prompts 具体收集方式在上述 `onCollectServerInfo` 方法中已经实现，这里不再赘述。

### 重启 nginx 服务

重启 nginx 服务，可以看上述 `onRestartNginx` 方法，通过 `ssh.execCommand('cd /usr/local/nginx/sbin && ./nginx -s reload')` 命令实现。

### 重启 node 服务

重启 node 服务，可以看上述 `onRestartServer` 方法，通过 `ssh.execCommand('pm2 delete 0')`、`ssh.execCommand('pm2 start 服务器 node 服务路径')` 等命令实现。

## 项目源码

当前工具项目源码可在 github 上查看 [dnhyxc-tools/packages/ci](https://github.com/dnhyxc/dnhyxc-tools/tree/master/packages/ci)

## 总结

本文主要介绍了发布前台项目及后台 node 服务端项目的流程，主要涉及到收集用户输入信息、连接服务器、压缩文件、上传文件、删除服务器上的 dist 文件、解压服务器上刚上传的 dist.zip 文件、删除本地 dist.zip 文件、服务端项目安装依赖、重启 node 服务等操作。通过这些操作，实现了一个在项目打包之后可直接自动发布的工具。同时还介绍了，如何通过 `node-ssh` 模块实现对 nginx 配置文件的修改和发布，以及如何通过 `node-ssh` 模块实现对 nginx 服务的重启等。
