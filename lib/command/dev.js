const express = require('express');
const path = require('path')
const fs = require('fs')
const open = require('open')
const { createProxyMiddleware } = require('http-proxy-middleware')
const axios = require('axios')
const _ = require('lodash')
const getPort = require('get-port')
const config = require('../config/const');
const getProjectList = require('../util/getProjectList')

const { HOST_APP_ORIGIN_MAP } = config

const proxyFileSuffixList = 'js|json|css|html|png|jpg|gif|map|ico|ttf|woff|svg';

const getIdlePort = async defaultPort => {
    return await getPort({port: getPort.makeRange(defaultPort, defaultPort + 100)})
}

module.exports = async ({
    projects,
    port,
    env,
    withoutBrowser
}) => {

    console.log("project", projects, port, env, withoutBrowser)
    let remoteHostAppOrigin = HOST_APP_ORIGIN_MAP[env.FRONTEND_ENV] || HOST_APP_ORIGIN_MAP['prod'],
        hostAppOrigin = remoteHostAppOrigin
        // localHostAppOrigin,
        // localStarter;

        console.log("remoteHostAppOrigin", hostAppOrigin)
    let servicePort = 4000

    const app = express();

    const readyHandler = _.once(async () => {
        const getRemoteHTML = async () => {
            const res= await axios.get(hostAppOrigin);
            // console.log("res", res)
            return res.data;
        }
        // 获取远程代理，并启动反向代理
        let html = await getRemoteHTML();
        // 获取本地项目webpack编译好的代码，启动反向代理
        // console.log("html", html)
        const projectProxy = createProxyMiddleware({ target: hostAppOrigin, changeOrigin: true });
        app.use(new RegExp(`.*\\.(${proxyFileSuffixList})$`), projectProxy);
        app.get('*', async(req, res) => {
            // const html = `<div>html内容</div>`
            res.send(html)
        })
        startServer();
        if(withoutBrowser){
            return
        }
        open(`http://localhost:${servicePort}`, { app: 'google chrome'})
    })

    const finalProjects = getProjectList(projects, []);
    console.log('finalProjects', finalProjects)

    finalProjects.forEach(async projectOptions => {
        const { projectPath, project } = projectOptions;
        const projectPort = (port = await getIdlePort(port + 1))
        console.log("projectPort", projectPath, project)

    })

    const runDev = ({ dev, project, parentProject, port, projectPath }) => {
        const createProxy = _.once(({port, prefix}) => {
            const projectOrigin = `http://localhost:${port}`;
            const projectProxy = createProxyMiddleware({target: projectOrigin, changeOrigin: true});
            app.use(new RegExp(`^${prefix}.*\\.(${proxyFileSuffixList})$`), projectProxy);
        })

        let dependences;
        const dependencePath = path.join(projectPath, '.console', 'dependences.js');

        if(fs.existsSync(dependencePath)){
            try {
                dependences = require(dependencePath)
                console.log('dependeces', dependences)
            }catch(err){
                console.log("get dependes error", err.message)
            }
        }

        dev({

        })
    }

    const startServer = () =>
        app.listen(servicePort, () => console.log(`Console run dev listening on port ${servicePort}!`));

    readyHandler()
}

/**
 * 1、执行启动命令，获取对应参数
 * 2、获取远程项目代码
 * 2、获取要开发子项目更新依赖，在项目下执行yarn add
 *      1、启动子项目的webpack
 *          1、拉取子项目依赖
 *          2、对比版本和更新依赖
 *      2、配置反向代
 *          1、需要远程拉取的项目启动反向代理
 *          2、本地启动的项目通过关键字代理
 *      3、整体启动项目
 * 3、监听本地项目代码或配置更新，重新编译
 **/ 