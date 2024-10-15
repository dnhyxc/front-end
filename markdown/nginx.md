### nginx 常用命令

启动 Nginx：nginx

停止 Nginx：nginx -s stop

重新加载 Nginx：nginx -s reload

检查 Nginx 配置文件：nginx -t（检查配置文件的正确性）

查看 Nginx 版本：nginx -v

### 其他常用的配合脚本命令

查看进程命令：ps -ef | grep nginx

查看日志，在 logs 目录下输入指令：more access.log

### new conf

```yaml
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;
#717new

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile  on;
  keepalive_timeout   65;
  client_max_body_size  100m;  #上传size改为20m，防止文件过大无法上传

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    #tcp_nopush     on;

    #keepalive_timeout  0;

    gzip  on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_http_version 1.0;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;

    server {
        listen       9216;
        server_name  wwww.dnhyxc.cn;

        #SSL 默认访问端口号为 443
        #listen 9216 ssl;
        #请填写绑定证书的域名
        #server_name dnhyxc.cn;
        #请填写证书文件的相对路径或绝对路径 cloud.tencent.com_bundle.crt;
        #ssl_certificate /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn_bundle.crt;
        #请填写私钥文件的相对路径或绝对路径
        #ssl_certificate_key /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn.key;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
       	root  /usr/local/nginx/dnhyxc/dist; #设置前端资源包的路径
      index   index.html  index.htm;  #设置前端资源入口html文件
      try_files   $uri  $uri/ /index.html;  #解决 browserRouter 页面刷新后出现404
          add_header Cache-Control "must-revalidate";
	  add_header Expires 0;
	  # add_header Cross-Origin-Opener-Policy same-origin;
    # add_header Cross-Origin-Embedder-Policy require-corp;
    # Cross-Origin-Opener-Policy 确保页面在使用 window.open() 打开其他页面时，只能与同一站点的页面共享 opener 对象，从而增强安全性。具体来说，same-origin-allow-popups 指示浏览器只允许来自相同源（同一站点）的页面使用 window.open() 方法创建的弹出窗口（popups）。这个设置有助于增强安全性，防止恶意网站或跨站点攻击利用弹出窗口功能进行欺诈或攻击行为。
    add_header Cross-Origin-Opener-Policy same-origin-allow-popups;
    # Cross-Origin-Embedder-Policy 控制页面在被其他站点嵌入时的安全行为，unsafe-none 设置允许在任何上下文中嵌入页面，但这也带来了潜在的安全风险。
    add_header Cross-Origin-Embedder-Policy unsafe-none;
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


location /atlas/ {
      root  /usr/local/server/src/upload/atlas;
      rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
      proxy_pass  http://localhost:9112;
    }

location /files/ {
      root  /usr/local/server/src/upload/files;
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

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }

server {
    # listen  80;
    # server_name  www.dnhyxc.cn;

    #SSL 默认访问端口号为 443
    listen 443 ssl;
    #请填写绑定证书的域名
    server_name dnhyxc.cn;
    #请填写证书文件的相对路径或绝对路径 cloud.tencent.com_bundle.crt;
    ssl_certificate /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn_bundle.crt;
    #请填写私钥文件的相对路径或绝对路径
    ssl_certificate_key /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn.key;

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

server {
    listen  9116;
    server_name  www.dnhyxc.cn;

    location / {
      root  /usr/local/nginx/dnhyxc-app/dist;
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

    location /atlas/ {
      root  /usr/local/server/src/upload/atlas;
      rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
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

server {
    listen  9612;
    server_name  www.dnhyxc.cn;

    location / {
      root  /usr/local/nginx/web/dist;
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




server {
    # listen  8099;
    # server_name  wwww.dnhyxc.cn;

    #SSL 默认访问端口号为 443
    listen 8090 ssl;
    #请填写绑定证书的域名
    server_name dnhyxc.cn;
    #请填写证书文件的相对路径或绝对路径 cloud.tencent.com_bundle.crt;
    ssl_certificate /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn_bundle.crt;
    #请填写私钥文件的相对路径或绝对路径
    ssl_certificate_key /usr/local/nginx/certs/dnhyxc.cn_nginx/dnhyxc.cn.key;

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

  # server {
  #   listen 9216;
  #   server_name dnhyxc.cn;
  #   return 301 https://$host$request_uri;
  # }

  server {
    listen 80;
    server_name dnhyxc.cn;
    return 301 https://$host$request_uri;
  }

  server {
    listen 8090;
    server_name dnhyxc.cn;
    return 301 https://$host$request_uri;
  }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

### old conf

```conf
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
  worker_connections  1024;
}

http {
  include       mime.types;
  default_type  application/octet-stream;
  sendfile  on;
  keepalive_timeout   65;
  client_max_body_size  20m;  #上传size改为20m，防止文件过大无法上传

  #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
  #                  '$status $body_bytes_sent "$http_referer" '
  #                  '"$http_user_agent" "$http_x_forwarded_for"';
  #access_log  logs/access.log  main;
  #tcp_nopush     on;

  #keepalive_timeout  0;

  gzip  on;

  #80端口资源前端资源配置，每个不同的端口对应一个前端项目
  server {
    listen       80;
    server_name  wwww.dnhyxc.cn;
    #charset koi8-r;
    #access_log  logs/host.access.log  main;

    #项目静态资源访问配置
    location / {
      root  /usr/local/nginx/dnhyxc/dist; #设置前端资源包的路径
      index   index.html  index.htm;  #设置前端资源入口html文件
      try_files   $uri  $uri/ /index.html;  #解决 browserRouter 页面刷新后出现404
    }

    #接口代理
    location /api/ {
      proxy_set_header  Host  $http_host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  REMOTE-HOST $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass  http://localhost:9112;
    }

    #代理访问上传到服务器 /upload/image 文件夹下的资源，如 http://101.43.50.15/image/b259b0afde3506761cda3dc953f17f6a.jpg
    #如果不设置这个代理，图片资源就会作为项目路由进行访问，则无法正确访问到图片资源
    location /image/ {
      root  /usr/local/server/src/upload/image;
      rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
      proxy_pass  http://localhost:9112;
    }

    #代理访问上传到服务器 /upload/atlas 文件夹下的资源，即以 /atlas 开头的路径，
    #会被转发到服务器上的 /usr/local/server/src/upload/atlas 目录下访问资源
    location /atlas/ {
      root  /usr/local/server/src/upload/atlas;
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

  #9216端口资源前端资源配置，每个不同的端口对应一个前端项目
  server {
    listen  9216;
    server_name  www.dnhyxc.cn;

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

    error_page  500 502 503 504 /50x.html;
    location = /50x.html {
      root  html;
    }
  }

  #9116端口资源前端资源配置，每个不同的端口对应一个前端项目
  server {
    listen  9116;
    server_name  www.dnhyxc.cn;

    location / {
      root  /usr/local/nginx/html_web/dist;
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

    error_page  500 502 503 504 /50x.html;
    location = /50x.html {
      root  html;
    }
  }

  #9612端口资源前端资源配置，每个不同的端口对应一个前端项目
  server {
    listen  9612;
    server_name  www.dnhyxc.cn;

    location / {
      root  /usr/local/nginx/web/dist;
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
    error_page  500 502 503 504 /50x.html;
    location = /50x.html {
      root  html;
    }
  }

  #8090端口资源前端资源配置，每个不同的端口对应一个前端项目
  server {
    listen  8090;
    server_name  wwww.dnhyxc.cn;

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
}
```
