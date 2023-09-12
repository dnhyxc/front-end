```conf
# LightProxy Default Rules, Input / to insert
# 初始规则可以让一些日常使用软件在代理下工作
# command+s to save
# Double click to enable/disable rule

# hosts bindings
# 10.101.73.189  g.alicdn.com
# 140.205.215.168  i.alicdn.com b.alicdn.com  u.alicdn.com

# mapping web page
# https://www.google.com https://www.alibaba.com

# mapping to file
# https://www.google.com file:///User/xxx/xxx.html

# mapping by wildcard
# ^https://*.example.com file:///User/xxx/xxx.html

# More usage follow document: https://alibaba.github.io/lightproxy/quick-start.html

# https://juejin.cn/post/7151950909864902686

# 将线上地址代理到10.1.20.52:8888（解决开启了 lightProxy 与电脑本地代理产生冲突的问题）
http://gxtymh.gx.cmcc:21006 proxy://10.1.20.52:8888

# 将线上入口js资源代理到本地入口js资源
http://gxtymh.gx.cmcc:21006/portal/index_07744.js file:///Users/shinemo/Downloads/portal/index_d283e.js

# 将线上portal/代理到本地portal/，已解决无法访问到本地其它js资源的问题
http://gxtymh.gx.cmcc:21006/portal/ file:///Users/shinemo/Downloads/portal/
```
