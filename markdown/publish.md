### mac 连接远程服务器

首先输入 `ssh root@47.97.107.28`，47.97.107.28 为服务器公网 IP。接着输入密码即可完成连接。

### [mac 上传文件到服务器](https://blog.csdn.net/liaowenxiong/article/details/115498469)

在本地终端中输入：

```yaml
#将本地桌面上的 dnhyxc-mac.zip 上传到远程服务器的 /usr/local/server/src/upload/files/ 目录下
dnhyxc@dnhyxcdeMacBook-Pro: scp /Users/dnhyxc/Desktop/dnhyxc-mac.zip root@101.43.50.15:/usr/local/server/src/upload/files/
```

> 注意：不是在服务器上的终端中输入。

### [将远程服务器上的某个文件下载到本地](https://blog.csdn.net/liaowenxiong/article/details/115498469)

在本地终端中输入：

```yaml
#将远程服务器上 /usr/local/server/src/upload.tar 目录下的 upload.tar 文件下载到本地桌面上
dnhyxc@dnhyxcdeMacBook-Pro: scp root@101.43.50.15:/usr/local/server/src/upload.zip /Users/dnhyxc/Desktop
```

> 注意：不是在服务器上的终端中输入。

### 安装 lrzsz

lrzsz 安装之后，就能使用 `rz` 命令上传本地文件到服务器上了。

```
yum -y install lrzsz
```

### 安装 node/pm2/yarn

在 node 官网下载 linux 版本的 node 压缩包：

输入命令 `cd /usr/local` 进入到 local 文件夹中。进入到 local 文件夹中后，输入命令 `mkdir node` 创建一个 node 文件夹。在 node 目录下输入命令`rz`将下载的 node 包放入 `/usr/local/node` 文件夹中。

输入`tar -vxf node-v14.9.0-linux-x64.tar.xz` 将 node 进行解压。

`cd node-v14.9.0-linux-x64 cd bin` 到 node-v14.9.0-linux-x64 下的 bin 目录中，接着输入命令 `ln -s /usr/local/node/node-v14.9.0-linux-x64/bin/node /usr/local/bin/node` 设置 node 环境变量。

`cd node-v14.9.0-linux-x64 cd bin` 到 node-v14.9.0-linux-x64 下的 bin 目录中，接着输入命令 `ln -s /usr/local/node/node-v14.9.0-linux-x64/bin/npm /usr/local/bin/npm`设置 node 环境变量。

`cd node-v14.9.0-linux-x64 cd bin` 到 node-v14.9.0-linux-x64 下的 bin 目录中，接着输入命令 `ln -s /usr/local/node/node-v14.9.0-linux-x64/bin/yarn /usr/local/bin/yarn`设置 node 环境变量。

`cd node-v14.9.0-linux-x64 cd bin` 到 node-v14.9.0-linux-x64 下的 bin 目录中，接着输入命令 `ln -s /usr/local/node/node-v14.9.0-linux-x64/bin/pm2 /usr/local/bin/pm2` 设置 node 环境变量。

具体命令总结如下，依次执行即可：

```js
cd /usr/local

mkdir node

cd node

rz // 选择node-v14.9.0-linux-x64.tar.xz

tar -vxf node-v14.9.0-linux-x64.tar.xz

cd node-v14.9.0-linux-x64/bin

ln -s /usr/local/node/node-v14.9.0-linux-x64/bin/node /usr/local/bin/node

ln -s /usr/local/node/node-v14.9.0-linux-x64/bin/npm /usr/local/bin/npm

npm i yarn -g

ln -s /usr/local/node/node-v14.9.0-linux-x64/bin/yarn /usr/local/bin/yarn

npm i pm2 -g

ln -s /usr/local/node/node-v14.9.0-linux-x64/bin/pm2 /usr/local/bin/pm2
```

### pm2 常用命令

`pm2 start ./src/main.js`：启动项目。

`pm2 list`：显示所有进程信息。

`pm2 info 进程 id（如：0）`：显示 id 为 0 的进程详细信息。

`pm2 monit`：进入监视页面，监视每个 node 进程的 CPU 和内存的使用情况。

`pm2 stop/delete 0`：停止/删除 id 为 0 的进程。

`pm2 stop/delete all`：停止/删除所有进程。

`pm2 restart 0`：0 秒停机重载 id 为 11 进程（用于 NETWORKED 进程）。

`pm2 reload 0`：重启 id 为 0 的进程。

`pm2 restart all`：重启所有进程。

`pm2 restart all`：重载所有进程。

`pm2 logs`：显示所有进程的日志。

`pm2 logs 0`：显示进程 id 为 0 的日志。

`pm2 flush`：清空所有日志文件。

`pm2 reloadLogs`：重载所有日志。

`pm2 startup`：产生 init 脚本，保持进程活着。

### node 项目部署

`cd /usr/local` 到 local 文件夹中，接着输入 `mkdir server` 创建一个 server 文件夹。

`cd server` 进入到 server 目录下，接着输入命令 `rz` 回车后，选择压缩好的服务包。

输入 `unzip xxx.zip` 将项目解压。

在 server 目录下执行 `yarn install` 安装项目所需依赖。依赖安装完毕之后，可执行 `npm start` 启动项目。当然，也可以选择不现在马上启动，等装完 `pm2` 之后再启动。

具体命令依次如下：

```js
cd /usr/local

mkdir server

cd server

rz // 选择压缩好的后台服务项目

unzip xxx.zip

yarn install

cd src

mkdir upload

cd upload

mkdir image
```

### 解决 pm2 启动项目时 status 为 error 的情况

在服务器中依次执行下列命令即可：

```js
ps aux | grep pm2

kill -9  pm2项目对应的进程

pm2 update
```

### 安装及启动 mongodb

首先到官网根据自己的服务器下载对应的 Mongodb 压缩包。

`cd /usr/local` 目录下，使用 `mkdir mongodb` 创建 mongodb 文件夹。

`cd /` 到根目录，使用命令 `mkdir -p /data/db` 创建 db 文件夹。再使用 `mkdir -p /data/log` 创建 log 文件夹。

`cd /usr/local/mongodb` 文件夹下，使用 `rz` 命令将我下载好的压缩包通过了 `tar -vxf mongodb-linux-x86_64-rhel70-5.0.14.tgz` 进行解压。

`cd mongodb-linux-x86_64-rhel70-5.0.14/bin` 目录，再使用 `./mongod --dbpath=/data  --logpath=/data/log/mongod.log --fork` 在后台启动 mongodb。

具体命令依次如下：

```js
cd /usr/local

mkdir mongodb

cd /

mkdir -p /data/db

mkdir -p /data/log

cd /usr/local/mongodb

rz // 选择下载好的 mongodb-linux-x86_64-rhel70-5.0.14.tgz 压缩包

tar -vxf mongodb-linux-x86_64-rhel70-5.0.14.tgz

cd mongodb-linux-x86_64-rhel70-5.0.14/bin

./mongod --dbpath=/data  --logpath=/data/log/mongod.log --fork
```

### 链接数据库

```js
cd mongodb/bin
./mongo
```

### 配置 mongodb 环境变量

首先在 mongodb/mongodb-linux-x86_64-rhel70-5.0.14/bin 目录执行 `pwd` 获取 mongodb 的所在路径。

`cd etc` 到 etc 目录下。执行 `vi profile` 命令。接着输入 `export PATH=/usr/local/mongodb/mongodb-linux-x86_64-rhel80-5.0.10/bin:$PATH`，设置完毕后保存。之后输入 `source profile` 让配置生效。

### 安装 nginx

[去官网下载 nginx：](https://nginx.org/en/download.html)

选择下载 Stable version 下的第二个版本：如 nginx-1.22.0 pgp。

### 解压 nginx

首先在 `/usr/local` 文件目录中创建一个 `nginx` 文件夹，接着进入 `nginx` 文件夹，将 `nginx-1.22.1.tar.gz` tar 包放入 nginx 文件夹中。接着在 nginx 文件夹中解压该 tar 包。具体命令依次如下：

```js
cd /usr/local

mkdir nginx

cd nginx

rz

tar -vxf nginx-1.22.1.tar
```

### 执行 configure 等命令

进入 `/usr/local/nginx/nginx-1.22.1` 文件目录中，依次按如下命令执行：

```js
cd /usr/local/nginx/nginx-1.22.1

./configure

make

make install
```

### nginx 上传报错

413 Request Entity Too Large：这是由于请求实体过大，需要在 nginx 的 http 配置中增加如下设置：

```js
http {
  client_max_body_size 20m;
}
```

上述设置设置完成之后， 在 nginx 下的 sbin 目录下执行 `./nginx -s reload` 重启 nginx 服务即可。

#### nginx 常见报错处理

解决 nginx: [error] open() ＂/usr/local/nginx/logs/nginx.pid＂ failed 错误：

```js
[root@localhost nginx]# /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

### 部署前端项目

进入 `/usr/local/nginx/html/dist`，之后将打包好的前端资源包 dist.zip 使用 `rz` 命令上传到 html 下的 dist 文件夹中，接着使用 `unzip dist.zip` 将 dist.zip 解压即可。

### 部署后端项目

进入 `/usr/local/server` 文件夹下，使用 `rz` 命令将压缩好的后端资源上传到 server 文件夹中，接着使用 `unzip dist.zip` 将 dist.zip 解压。解压完成之后，在 server 文件目录下执行 `yarn` 下载项目依赖。

### 重启服务

使用 `pm2 list` 查看项目是否在启动状态，如果在启动状态的化，使用 `pm2 delete 项目启动id` 关闭原本启动的项目。接着使用 `pm2 ./src/main.js` 重新启动项目。

### 重启 nginx

前端资源部署完成之后，需要重启 nginx 使部署的资源生效。进入 `/usr/local/nginx/sbin` 目录下，执行 `./nginx -s reload` 即可重启项目。此时即可去浏览器中查看资源是否生效了。

### nginx 配置

当需要在一台 nginx 服务器上配置多个前端项目时，需要在 `/usr/local/nginx/` 目录下创建一个 `html_admin` 文件夹，同时更改 nginx 中另一个 server 中监听的端口号，具体如下：

```conf
worker_processes  1;

events {
  worker_connections  1024;
}

http {
  include   mime.types;
  default_type  application/octet-stream;
  sendfile  on;
  keepalive_timeout   65;
  client_max_body_size  20m;  #上传size改为20m，防止文件过大无法上传

  server {
    listen  80; 监听80端口
    server_name   43.143.27.249; #服务器公网域名，或者设置为localhost

    location / {
      root  /usr/local/nginx/html/dist; #设置前端资源包的路径
      index   index.html  index.htm;  #设置前端资源入口html文件
      try_files   $uri  $uri/ /index.html;  #解决 browserRouter 页面刷新后出现404
    }

    #为前台项目代理服务接口
    location /api/ {
      proxy_set_header  Host  $http_host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  REMOTE-HOST $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass  http://localhost:9112;
    }

    #设置服务器图片资源的代理
    location /image/ {
      root  /usr/local/server/src/upload/image;
      rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
      proxy_pass  http://localhost:9112;
    }

    error_page  500 502 503 504 /50x.html;
    location = /50x.html {
      root  html;
    }
  }

  #为后台项目代理服务接口
  server {
    listen  8090;
    server_name  localhost;

    location / {
      root  /usr/local/nginx/html_admin/dist; #设置前端资源包的路径
      index   index.html  index.htm;  #设置前端资源入口html文件
      try_files   $uri  $uri/ /index.html;  #解决 browserRouter 页面刷新后出现404
    }

    #为后台项目代理服务接口
    location /admin/ {
      proxy_set_header  Host  $http_host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  REMOTE-HOST $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass  http://localhost:9112;
    }
  }

  # websocket 配置
  server {
    listen  9002;
    server_name 127.0.0.1;
    location / {
      # proxy_set_header Upgrade $http_upgrade;
      # proxy_set_header Connection "upgrade";
    }
    location /ws {
        proxy_set_header  Host  $http_host;
        proxy_set_header  X-Real-IP $remote_addr;
        proxy_set_header  REMOTE-HOST $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass  http://127.0.0.1:9112;
       # proxy_set_header Upgrade $http_upgrade;
       # proxy_set_header Connection "upgrade";
    }
  }
}
```

### nginx 配置 https

首先去腾讯云申请免费证书，申请通过之后，下载 nginx 类型的证书文件文件，之后将证书文件上传到服务器的某个目录中，本人将证书放在服务器 `/usr/local/nginx/certs` 目录下。 之后通过 `unzip xxx.zip` 解压上传的证书 zip 压缩包。

在命令行未连接服务器的情况下运行 `scp /Users/dnhyxc/Desktop/dnhyxc.cn_nginx.zip  root@101.43.50.15:/usr/local/nginx/certs`

- /Users/dnhyxc/Desktop/dnhyxc.cn_nginx.zip：本地证书压缩包路径。

- root@101.43.50.15:/usr/local/nginx/certs：服务器放置证书的路径。

证书解压完成后，会得到四个文件，分别是：

1. dnhyxc.cn_bundle.crt

2. dnhyxc.cn_bundle.pem

3. dnhyxc.cn.key

4. dnhyxc.cn.csr

上述四个文件中，我们实际用到的是 `dnhyxc.cn_bundle.crt` 和 `dnhyxc.cn.key` 这两个文件。

具体用法为：修改 nginx.conf 配置文件，需要把 `listen 80` 改为默认的 443 端口 `listen 443 ssl`，或者自己制定端口 `listen 8090 ssl`，并在 `server` 块中增加如下内容：

- 443 默认端口配置：

```conf
server {
  # listen  80;
  # server_name  www.dnhyxc.cn;

  #https配置修改内容开始
  #SSL 默认访问端口号为 443
  listen 443 ssl;
  #请填写绑定证书的域名
  server_name dnhyxc.cn;

  #请填写证书文件的相对路径或绝对路径 cloud.tencent.com_bundle.crt;
  ssl_certificate /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn_bundle.crt;
  #请填写私钥文件的相对路径或绝对路径
  ssl_certificate_key /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn.key;
  #https配置修改内容结束

  location / {
    root  /usr/local/nginx/html/dist;
    index   index.html  index.htm;
    try_files   $uri  $uri/ /index.html;
  }

  location /api/ {
    proxy_set_header  Host  $http_host;
    proxy_set_header  X-Real-IP $remote_addr;
    proxy_set_header  REMOTE-HOST $remote_addr;
    proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass  http://localhost:9112;
  }

  location /image/ {
    root  /usr/local/server/src/upload/image;
    rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
    proxy_pass  http://localhost:9112;
  }

  location /files/ {
    root  /usr/local/server/src/upload/files;
    rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
    proxy_pass  http://localhost:9112;
  }

  error_page  500 502 503 504 /50x.html;

  location = /50x.html {
    root  html;
  }
}
```

- 自定义端口配置：

```conf
server {
  # listen  8099;
  # server_name  wwww.dnhyxc.cn;

  #https配置修改内容开始
  listen 8090 ssl;
  #请填写绑定证书的域名
  server_name dnhyxc.cn;
  #请填写证书文件的相对路径或绝对路径 cloud.tencent.com_bundle.crt;
  ssl_certificate /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn_bundle.crt;
  #请填写私钥文件的相对路径或绝对路径
  ssl_certificate_key /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn.key;
  #https配置修改内容结束

  location / {
    root  /usr/local/nginx/html_admin/dist;
    index   index.html  index.htm;
    try_files   $uri  $uri/ /index.html;
  }

  location /admin/ {
    proxy_set_header  Host  $http_host;
    proxy_set_header  X-Real-IP $remote_addr;
    proxy_set_header  REMOTE-HOST $remote_addr;
    proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass  http://localhost:9112;
  }
}
```

### nginx 报错处理

解决 nginx: [error] open() ＂/usr/local/nginx/logs/nginx.pid＂ failed 错误，具体操作如下：

```
cd/usr/local/nginx /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

nginx 重启错误解决: nginx: [alert] kill(8767, 1) failed (3: No such process)

```
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

### 复制 upload 资源

将 upload 资源复制到 server 中：

```json
cp -r /usr/local/server/src/upload /usr/local/server/

cp -r /usr/local/server/src/upload /usr/local/   // 复制到local
```

将 upload 资源从 server 复制到 src 中：

```json
cp -r /usr/local/server/upload /usr/local/server/src/

cp -r /usr/local/upload /usr/local/server/src/  // 从local复制到src
```

### mac 终止占用的端口

查询占用端口的 PID：

```conf
lsof -i tcp:port(如：9012)

#COMMAND   PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
#node    56185 dnhyxc   24u  IPv6 0x6acfe600190c69b3      0t0  TCP *:9012 (LISTEN)
```

终止端口对应的进程：

```conf
kill -9 PID #PID，如 56185
```

#### nginx

```
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root  /usr/local/nginx/html/dist; #设置前端资源包的路径
        index   index.html  index.htm;  #设置前端资源入口html文件
        try_files   $uri  $uri/ /index.html;  #解决 browserRouter 页面刷新后出现404
    }

    location /api/ {
        proxy_set_header  Host  $http_host;
        proxy_set_header  X-Real-IP $remote_addr;
        proxy_set_header  REMOTE-HOST $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass  http://localhost:9112;
    }

    location /image/ {
        root  /usr/local/server/src/upload/image;
        rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
        proxy_pass  http://localhost:9112;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}


server {
    listen  9216;
    server_name  localhost;

    location / {
      root  /usr/local/nginx/dnhyxc/dist;
      index   index.html  index.htm;
      try_files   $uri  $uri/ /index.html;
    }

    location /api/ {
      proxy_set_header  Host  $http_host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  REMOTE-HOST $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass  http://localhost:9112;
    }

    location /admin/ {
      proxy_set_header  Host  $http_host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  REMOTE-HOST $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass  http://localhost:9112;
    }

    location /image/ {
      root  /usr/local/server/src/upload/image;
      rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
      proxy_pass  http://localhost:9112;
    }

    error_page  500 502 503 504 /50x.html;
    location = /50x.html {
      root  html;
    }
}

server {
    listen  8090;
    server_name  localhost;

    location / {
      root  /usr/local/nginx/html_admin/dist;
      index   index.html  index.htm;
      try_files   $uri  $uri/ /index.html;
    }

    location /admin/ {
      proxy_set_header  Host  $http_host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  REMOTE-HOST $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass  http://localhost:9112;
    }
}

server {
    listen  9002;
    server_name 127.0.0.1;
    location /ws {
        proxy_set_header  Host  $http_host;
        proxy_set_header  X-Real-IP $remote_addr;
        proxy_set_header  REMOTE-HOST $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass  http://127.0.0.1:9112;
    }
}
```
