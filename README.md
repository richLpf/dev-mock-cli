# u-admin-cli

该cli项目为个人项目，主要是将工作中，不同的项目模板进行归类，方便下次开发直接使用，当然需要不定期更新。

### 一、本地开发

```
cd u-admin-cli
yarn install
yarn dev [command]
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

app-cli create <myapp>

```
将自动在对应目录下新建项目myapp

### 四、版本更新

- 1.0.0 测试版本
- 1.0.1 提供下载create-react-app最基础的版本

### 五、目录结构

施工中...
### 六、发布版本

> 登录npm

npm config set registry https://registry.npmjs.org/

```
npm login
```

1、修改版本号,执行下面命令

```
npm run publish:patch
```
2、撤回24小时内发布的版本，撤回后24小时内不允许发布

```
npm unpublish u-admin-cli@1.0.2
```

### 七、说明

当前项目下载的react模板，提供的功能将会不断完善

【p1】基于node的项目模板

一、express

【p2】基础go的后端项目模板

一、go项目模板

【p3】基于vue的项目模板