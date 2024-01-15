### 初始化项目

使用 `pnpm init` 生成 `package.json`。

```js
pnpm init
```

### 安全性设置

为了防止我们的根目录被当作包发布，需要在 package.json 加入如下设置：

```js
{
  "private": true
}
```

### 新建 pnpm-workspace.yaml

在根目录下新建 `pnpm-workspace.yaml` 文件：

```js
packages: -"packages/*";
```

### 安装全局依赖包命令

使用 `pnpm add xxx -Dw` 在项目根目录下安装依赖包。

- `-D` 表示安装到 devDependencies。

- `-w` 表示安装到根目录下。

```js
// 在根目录下安装依赖包
pnpm add rollup typescript -Dw
```

### 为子包安装依赖

给子包安装依赖，常用的有以下两种方式：

- 进入需要安装包的子包中，通过 `pnpm add xxx` 安装依赖。

- 通过过滤参数 `--filter` 或 `-F` 指定命令作用范围，格式如下：

```
pnpm --filter/-F 需要安装依赖包的文件目录 依赖包名称
```

假设在 packages 目录下新建两个子包，分别为 tools 和 utils，假如我要在 utils 包下安装 loadsh，那么，可以执行以下命令：

```js
pnpm add --filter loadsh
```

[参考](https://juejin.cn/post/7184392660939964474)
