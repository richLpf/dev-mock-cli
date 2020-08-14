# u-admin-cli

项目描述：

该cli项目为个人项目，主要是将工作中，不同的项目模板进行归类，方便下次开发直接使用，当然需要不定期更新。

目前准备的模板有：

准备可以下载的模板有：

【p0】基于react的项目模板

一、react 后台管理系统（常用组件展示）
技术栈：react 16、 react hooks、 antd>4.0、  node>10

github地址：https://github.com/richLpf/react-admin.git

二、react 后台管理系统
ucloud公司内部项目开发，主要基于公司ui框架，权限管理等相关内容

gitlab地址：https://git.ucloudadmin.com/uxiao/u-front-template

三、react 移动端项目基建，基于企业微信的模板

四、react 项目，umi项目构建的聊天工具类项目

五、react 移动版本项目基建

六、react ui库实现

【p1】基于node的项目模板

一、express

【p2】基础go的后端项目模板

一、go项目模板

【p3】基于vue的项目模板






实现功能：

- 下载基于react、antd、axios的后台管理系统模型

## 快速开始

```
npm i -g u-admin-cli

app-cli create <myapp>

```
将自动在对应目录下新建项目myapp

## 版本更新

- 1.0.0 测试版本
- 1.0.1 提供下载create-react-app最基础的版本

## 目录结构

## 发布版本

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

## 说明

当前项目下载的react模板，提供的功能将会不断完善

