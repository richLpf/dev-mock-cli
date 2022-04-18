# u-admin-cli

该 cli 项目为个人项目，主要是将工作中，不同的项目模板进行归类，方便下次开发直接使用，当然需要不定期更新。

### 一、本地开发

```
cd u-admin-cli
yarn install
yarn start [command]
```

### 二、项目能力

实现功能：

- 1、拉取中台产品项目模版
- 2、启动一个微服务
- 3、生成项目组件
- 4、生成模拟接口
- 5、生成博客

### 三、快速开始

```
sudo npm i -g u-admin-cli

u-admin-cli create <myapp>

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