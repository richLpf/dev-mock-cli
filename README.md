## dev-mock-cli
支持能力/价值：
- Mock API
- 读取Swagger API，并生成接口
- 无需担心跨域问题
- 安装和启动方便

待办：
- [已完成]支持版本：node>=18
- [已完成]发布启动的配置信息汇总，提示产品使用文档：CLI使用说明，配置说明mock.config.json，提示当前运行的action风格还是restful风格
- [已完成]读取配置文件，全局使用处理，并确认默认文件的优先级：命令行 > 配置文件 > 默认配置
- [已完成]如何remote api,网络不通，进行告警，并不再转发
- [已完成]上传npm的时候，指定文件
- [已完成]restful: 读取swagger，生成json，处理中，晚上CLI的文档，用来测试
- TODO: 返回值固定匹配和规则定制
- 生成单元测试
- CLI使用文档
- 录制演示视频
- 优化打印日志，全部英文显示
- 配置npm可以发布的文件
- 支持自动生成mock.config.json
- 同时只能支持一个风格，当风格切换时，检测到有mock文件夹，则提示清空
  - 当用户之前用restful风格，后面切换成了action后，在代码里面兼容，如果读取格式不对，就报错
- TODO: .js默认加载
- TODO: 请求参数校验、返回数据特殊处理
- TODO: mock能力细节处理，支持不走本地的local json

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
npm unpublish dev-mock-cli@1.0.2
```

### 五、本地开发

```
cd dev-mock-cli
yarn install
yarn start [command]
```

规则
- 返回值固定匹配和规则定制
custom.rules.js

export default class 定义规则

- 固定值：RetCode: 0
- 具体字段的类型返回值: Name/UserName Id String 返回mock值
- 数据类型返回不同的值: Number 返回mock
