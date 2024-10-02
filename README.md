## dev-mock-cli

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

| 参数   | 别名 | 类型   | 默认值               | 描述                     |
| ------ | ---- | ------ | -------------------- | ------------------------ |
| create | c    | true   | 创建mock数据         |
| PORT   | P    | number | 启动本地服务的端口号 |
| type   | t    | string | action               | api类型：action、restful |

2、dev - 启动本地开发服务

| 参数               | 别名 | 类型    | 默认值               | 描述               |
| ------------------ | ---- | ------- | -------------------- | ------------------ |
| projects           | p    | array   | 启动的微应用名称     |
| PORT               | P    | number  | 启动本地服务的端口号 |
| withoutOpenBrowser | wb   | boolean | true                 | 取消自动打开浏览器 |
| env                | e    | object  |                      | 开发自定义环境变量 |

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


## 待办

- 安装在项目中
- 自动安装和启动，mock api
- 支持restful风格API
- 本地直接打开项目使用文档


- 配置html页面
- 添加默认配置
- 读取项目中的参数
- 优化日志
- 通过swagger API生成mock API
- 需要增加错误判断，避免程序报错退出
- 单元测试
- 使用文档
- 若端口被占用，重新启动一个端口
- 录制视频
