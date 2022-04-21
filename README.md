## u-admin-cli

- 通过简单的命令启动一个或多个Http服务器，模拟接口为前端开发调用
- 管理React后台模版项目

### 一、快速开始

```bash
sudo npm i -g u-admin-cli
```
**1、执行命令启动一个action的http服务**

```bash
u-admin-cli mock -c
```

![Action图](https://cdn.jsdelivr.net/gh/richLpf/pictures@main/gitbook/1650464330833action9000.png)

请求示例：

![postman-action](https://cdn.jsdelivr.net/gh/richLpf/pictures@main/gitbook/1650466106884action-api.png)


**2、执行命令启动一个restful的http服务**

```bash
u-admin-cli mock -c -t restful
```

![postman-action](https://cdn.jsdelivr.net/gh/richLpf/pictures@main/gitbook/1650464316833restful-api.png)

请求示例：

![postman-action](https://cdn.jsdelivr.net/gh/richLpf/pictures@main/gitbook/1650465986884api-restful.png)

**3、如何在项目中使用**

在package.json中添加`u-admin-cli mock`，默认API端口9000，风格为Action，如果需要更改restful请增加参数`u-admin-cli mock -t restful`

```json
"scripts": {
    "start": "react-app-rewired start && u-admin-cli mock",
}
```

在根目录新建`mock文件夹和对应的接口文件`

在项目中配置反向代理转发本地的接口

```
const { createProxyMiddleware } = require("http-proxy-middleware");

const proxyConfig = [
  {
    url: "/acl/*",
    target: "http://localhost:9000",
    changeOrigin: true,
  }
];

module.exports = (app) => {
  proxyConfig.forEach((item) => {
    app.use(
      item.url,
      createProxyMiddleware({
        target: item.target,
        changeOrigin: item.changeOrigin,
      })
    );
  });
};
```

### 二、启动一个Mock-API服务

#### action 风格的api

在mock文件新建`[Action].json`文件，Action为对应api的名字，如果请求地址路径有参数，可以创建多层

比如一个请求url: `http://localhost:9000/list`, Action: "List"的api，数据为

```json
{
    "RetCode": 0,
    "Message": "",
    "Data": [] 
}
```
在mock下新建list文件夹，并写入`List.json`, 执行命令`u-admin-cli mock`， 然后就可以请求接口了

![mock](https://cdn.jsdelivr.net/gh/richLpf/pictures@main/gitbook/1650466393888data.png)

还可以改动文件，再次请求接口内容也会跟着变化

```bash
u-admin-cli mock -n
```
### 三、功能介绍
1、mock - 启动本地开发服务

参数 | 别名 | 类型 | 默认值 | 描述
--- | --- | --- | --- | ---
create | c | true | 创建mock数据
PORT | P | number | 启动本地服务的端口号
type | t | string | action | api类型：action、restful

2、dev - 启动本地开发服务

参数 | 别名 | 类型 | 默认值 | 描述
--- | --- | --- | --- | ---
projects | p | array | 启动的微应用名称
PORT | P | number | 启动本地服务的端口号
withoutOpenBrowser | wb | boolean | true | 取消自动打开浏览器
env | e | object | | 开发自定义环境变量

- 1、首先启动服务，获取启动项目的html代码
- 2、挂载微服务的代码,子项目的port依次+1

### 四、发布版本


```bash
# 登录 npm
npm config set registry https://registry.npmjs.org/

npm login
```

1、修改版本号,执行下面命令

```
npm run publish:patch
```

2、撤回 24 小时内发布的版本，撤回后 24 小时内不允许发布

```
npm unpublish u-admin-cli@1.0.2
```

### 五、本地开发

```
cd u-admin-cli
yarn install
yarn start [command]
```

待完善：需要增加错误判断，避免程序报错退出