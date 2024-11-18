说明：前端的工作中，mock api是比较麻烦的事情，特别是API交付节点太晚导致前端项目延期背锅。所以构建了当前项目，用来配合前端项目快速生成mock API。

## 支持能力/价值：

1. Mock API
1. 读取Swagger文档，并生成API接口
1. 无需担心跨域问题
1. 安装方便：node环境一行指令安装/Docker启动
1. API生成读取顺序：本地mock -> swagger -> remote api

## 快速开始

要求node环境：node > 18，后续考虑降低成本

1、安装dev-mock-cli

```
yarn add -D dev-mock-cli
```

2、在项目根目录下新建`mock.config.json`
```
{
    "port": "9000",
    "type": "action",
    "proxyApiUrl": "http://localhost:9000",
    "cors": {
      "allowedHeaders": ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Accesstoken"],
      "allowCredentials": true,  
      "maxAge": 86400
    },
    "swaggerApi": [
      "http://subscri.xxx.com/swagger/doc.json", "http://subscri.xxx.com/swagger/doc1.json"
    ],
    "mockFields": {
        "RetCode": {
            "fixedValue": 0
        }
    }
}
```
配置文件解读

| 字段              | 说明                                                        |
| --------------- | --------------------------------------------------------- |
| port            | 启动本地服务的端口号，默认9000                                         |
| type            | api风格，默认restful                                           |
| proxyApiUrl     | 读取远程API服务，只需要写入远程服务的请求地址                                  |
| cors            | 跨域字段设置                                                    |
| swaggerAPI      | 需要生成API的swagger文档                                         |
| requestPriority | API读取的优先级，匹配到后将直接返回                                       |
| mockFields      | 特殊字段的配置，比如swagger中code是number类型，但是在实践中我们需要配置code字段为0，代表成功 |


## API数据来源配置

### 1、本地mock API

启动后，我们内置了一个api作为参考，我们这里来看下如何在本地文件mock api

原理：我们以目录为api请求路径，以文件名为请求方法。

不存在路由参数的请求：

*   比如`/v1/list/get.json`，当前文件匹配的请求为`Get`方法，路径为`/v1/list`
*   比如`/v1/list/post.json`，当前文件匹配的请求为`Post`方法，路径为`/v1/list`

存在路由参数的请求：

*   比如`/v1/list/{id}/get.json`， 当前文件匹配的请求为`Get`请求，id可以被替换成任意数字或字符串，匹配路径有：`/v1/list/1` `/v1/list/abc`

### 2、对接swagger

swagger文档生成后，只需要拿到当前swagger的json文件，写入配置文件即可，
然后访问对应的路由，即可生成返回参数

### 3、代理远程服务器API

在开发项目时，除了本地和swagger模拟的api，我们一般会有远程的api服务。

此时我们只需要在mock.config.json中配置`proxyApiUrl`， 即可进行反向代理，在本地mock和swagger都无法匹配到路由的时候，将会请求到proxyApiUrl代理的地址。

## 在项目中使用

在项目中安装：`yarn add -D dev-mock-cli`

我们可以在项目根目录下新建`mock.config.json`

```json
{
    "port": "9000",
    "type": "restful",
    "proxyApiUrl": "",
    "cors": {
      "allowedHeaders": ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Accesstoken"],
      "allowCredentials": true,  
      "maxAge": 86400
    },
    "swaggerApi": [],
    "requestPriority": ["local", "swagger", "proxy"],
    "mockFields": {
        "RetCode": {
            "fixedValue": 0
        }
    }
}
```

启动服务`yarn dev-mock-cli mock`，会自动在项目根目录下新建mock文件夹，并生成`list/get.json`，作为`/list`API的请求数据源。

当然也可以全局安装，然后随时启动`yarn global add dev-mock-cli`

## 通过docker使用

> 上面我们通过docker启动，只有本地的一个API，那么如何新增API，如何配置swagger和代理远程的服务，我们继续

新建目录`/data/api`，在当前目录下维护本地mock数据和配置文件

```
docker run -d -p 9000:9000 -v /data/api/mock:/app/mock -v data/api/mock.config.json:/app/mock.config.json lvpf/dev-mock-cli
```

只需要更新mock文件夹下的json数据即可操作API

## 解决问题记录

- 由于mockjs中引用commander需要支持node>18,所以做兼容处理

```package.json

"resolutions": {
    "mockjs/commander": "9.5.0"
}

```

## 更新记录

- 20241015
  - 监听mock目录下文件新增/删除，重启服务
  - 增加proxy代理请求日志
- 20241118
  - 支持生成配置文件mock.config.json
  - 支持node v16


## 待办&问题

- proxy代理请求超时
- 跨域配置
- 返回参数处理
- 路由参数变量匹配
- 请求参数匹配
- 操作视频