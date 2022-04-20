## u-admin-cli

u-admin-cli主要以下作用
- 通过简单的命令启动一个或多个Http服务器，模拟接口为前端开发调用
- 管理React后台模版项目

### 一、快速开始

```
sudo npm i -g u-admin-cli
```
**执行命令启动一个action的http服务**

```
u-admin-cli mock -c
```


**执行命令启动一个restful的http服务**
```
u-admin-cli mock -c -t restful
```


### 二、启动一个Mock-API服务

#### action 风格的api

在mock文件新建[Action].json文件，Action为对应api的名字，如果请求地址路径有参数，可以创建多层

比如一个请求url: http://localhost:9000/list, Action: "List"的api，数据为

```json
{
    "RetCode": 0,
    "Message": "",
    "Data": [] 
}
```
在mock下新建list文件夹，并写入`List.json`, 执行命令`u-admin-cli mock`， 然后就可以请求接口了


还可以改动文件，再次请求接口内容也会跟着变化


```
u-admin-cli mock -n
```

将自动在对应目录下新建项目 myapp

### 四、版本更新

- 1.0.0 测试版本
- 1.0.1 提供下载 create-react-app 最基础的版本

### 五、目录结构

施工中...

### 六、发布版本

> 登录 npm

npm config set registry https://registry.npmjs.org/

```
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

### 七、说明

当前项目下载的 react 模板，提供的功能将会不断完善

【p1】基于 node 的项目模板

一、express

【p2】基础 go 的后端项目模板

一、go 项目模板

【p3】基于 vue 的项目模板

### 八、功能介绍

#### 1、dev - 启动本地开发服务

参数 ｜ 别名 ｜ 类型 ｜ 默认值 ｜ 描述
--- ｜ --- ｜ --- ｜ --- ｜ ---
projects | p | array | 启动的微应用名称
PORT | P ｜ number | 启动本地服务的端口号
withoutOpenBrowser | wb | boolean | true | 取消自动打开浏览器
env | e | object | | 开发自定义环境变量

- 1、首先启动服务，获取启动项目的html代码
- 2、挂载微服务的代码,子项目的port依次+1

使用说明：

## action

u-admin-cli mock -t action -P 9000

请求url：http://localhost:9000/test  {Action: "record"}

在u-admin-cli运行的目录下新建 /mock/test/record.json，请求就会返回record.json


## restful

u-admin-cli mock -t restful

### get

请求url: http://localhost:9000/api/list {method: 'get'}

在u-admin-cli运行的目录下新建 /mock/api/list/get.json，请求就会返回get.json

### post

请求url: http://localhost:9000/api/list {method: 'post'}

在u-admin-cli运行的目录下新建 /mock/api/list/post.json，请求就会返回post.json


### cli使用

直接传递参数，生成mock文件夹和json文件，mock提示api接口请求的url，直接进行调用，restful风格，生成对应的

生成readme.md文件，介绍使用

### 一、本地开发

```
cd u-admin-cli
yarn install
yarn start [command]
```