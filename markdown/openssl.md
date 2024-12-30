## OpenSSL

[OpenSSL](https://slproweb.com/products/Win32OpenSSL.html) 是一个开源的加密库，用于实现各种加密算法（如对称加密、非对称加密、哈希函数等）和安全协议（如 SSL/TLS）。它广泛应用于网络通信安全、数据保护、证书管理等方面。

一般电脑都会自带 OpenSSL，可以使用 `openssl version` 查看版本，如果无法查看到对应版本，说明可能电脑中没有安装 `OpenSSL`。

### windows 安装 OpenSSL

windows 系统可以前往 [OpenSSL 官网](http://slproweb.com/products/Win32OpenSSL.html) 下载。其中有 4 种安装包：

- Win64 OpenSSL vx.x.x Light，安装 Win64 OpenSSL vx.x.x 最常用的软件包。

- Win64 OpenSSL vx.x.x，安装 Win64 OpenSSL vx.x.x 完整软件包。

- Win32 OpenSSL vx.x.x Light，安装 Win32 OpenSSL vx.x.x 最常用的软件包。

- Win32 OpenSSL vx.x.x，安装 Win32 OpenSSL vx.x.x 完整软件包。

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__188a5ce258057eb1f49f34a4d9a3c3e6_66efe5c8d80d0da837a3e600.webp)

可以根据自己的系统安装对应的版本，安装完成后使用 `openssl version` 验证版本。

### macOS 安装 OpenSSL

```
brew install openssl
```

安装后，可能需要将 OpenSSL 的路径添加到环境变量中。可以将以下内容添加到你的 shell 配置文件（如 ~/.bash_profile 或 ~/.zshrc）：

```
export PATH="/usr/local/opt/openssl@3/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/openssl@3/lib"
export CPPFLAGS="-I/usr/local/opt/openssl@3/include"
```

然后重新加载配置文件：

```
source ~/.zshrc  # 或 ~/.bash_profile
```

最后使用 `openssl version` 验证安装的版本。

### Linux 安装 OpenSSL

Debian/Ubuntu 系列（如 Ubuntu、Debian、Linux Mint）：

```
udo apt update
sudo apt install openssl
```

CentOS/RHEL 系列（如 CentOS、Red Hat Enterprise Linux、Fedora）：

- 对于 CentOS 7 及以下版本：

```
sudo yum install openssl
```

- 对于 CentOS 8 或 Fedora（使用 DNF 包管理器）：

```
sudo dnf install openssl
```

- Arch Linux：

```
sudo pacman -S openssl
```

## 自签名证书生成步骤

### 生成私钥文件

使用 OpenSSL 生成一个私钥文件 `server.key`（文件名可以自定义）：

```
openssl genpkey -algorithm RSA -out server.key -aes256
```

- openssl genpkey: 生成私钥。

- algorithm RSA: 使用 RSA 算法生成私钥。

- out server.key: 输出文件为 server.key，即私钥文件名。

- aes256: 使用 AES-256 加密私钥文件，要求在生成过程中输入一个密码。这是为了增加私钥文件的安全性。

### 创建证书签署请求（CSR）

生成证书签署请求（CSR），但这里我们不需要将其提交给证书颁发机构，而是直接自签。

```
openssl req -new -key server.key -out server.csr
```

- openssl req: 生成证书签署请求（CSR）。

- new: 表示这是一个新的请求。

- key server.key: 使用之前生成的私钥 server.key。

- out server.csr: 输出 CSR 文件，名为 server.csr。

### 生成自签名证书

使用生成的 CSR 和私钥创建自签名证书（server.crt），并设置证书的有效期为 365 天：

```
openssl x509 -req -in server.csr -signkey server.key -out server.crt -days 365
```

- openssl x509: 用于生成证书。

- req: 指定输入文件是一个 CSR。

- in server.csr: 输入文件是你在第 2 步中生成的 CSR 文件 server.csr。

- signkey server.key: 使用你生成的私钥 server.key 来签署证书。

- out server.crt: 输出生成的自签名证书文件名为 server.crt。

- days 365: 设置证书的有效期为 365 天。

经过上述三步，就有了自签名证书 `server.crt` 和私钥 `server.key`。

如果你希望在生产环境中使用证书，通常需要通过受信任的证书颁发机构（CA）来签署证书，而不是自签名证书。不过，在开发、测试或内部使用时，自签名证书完全可以满足需求。
