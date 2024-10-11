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
      {
        "title": "swagger",
        "type": "action",
        "url": "http://subscri.xxx.com/swagger/doc.json"
      }
    ],
    "mockFields": {
        "RetCode": {
            "fixedValue": 0
        }
    }
}
```
配置说明：待补充

3、启动mock

```
yarn dev-mock-cli mock
```