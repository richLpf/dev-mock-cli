const express = require('express');
const path = require('path')
const open = require('open')
const { createProxyMiddleware } = require('http-proxy-middleware')
const childProcess = require('child_process');
const _ = require('lodash')
const logger = require('../utils/logger')
const getPort = require('get-port')

const proxyFileSuffixList = 'js|json|css|png|jpg|gif|map|ico|ttf|woff|svg';

const getIdlePort = async defaultPort => {
    return await getPort({port: getPort.makeRange(defaultPort, defaultPort + 100)})
}

// 将webpack集成在cli中，启动cli指定端口号，然后starter选择+1的端口号启动，其他子应用依次启动+1的端口号
// 根目录下新增文件夹.config，可以配置webpack，提取依赖
// starter中，增加配置文件配置本地地址或远程地址，可以自启动也可以根据配置启动，cli读取，启动执行cli dev
// 构建执行cli build

module.exports = async ({
    projects,
    port,
    withoutBrowser,
    excludes,
    config,
    env,
}) => {

    const app = express();
    // 启动时传入一个环境变量，分别获取对应的路径
    const execPath = process.cwd()
    let configProjectsPath = path.join(execPath, './projects.json')
    let microAppPath = path.join(execPath, '../')

    if(process.env.NODE_ENV === "development"){
        configProjectsPath = path.join(execPath, `../starter/projects.json`)
        microAppPath = path.join(execPath, '../')
    }

    const configProjects = require(configProjectsPath)

    const { subProjects, starter, port:startPort } = configProjects
    console.log("startPort", startPort)

    const servicePort = startPort || port

    const readyHandler = _.once(() => {
        const CurrentProject = subProjects.filter(item => projects.includes(item.name))
        CurrentProject.unshift(starter)
        // const CurrentProject = subProjects.filter(item => projects.includes(item.name))
        console.log("CurrentProject", CurrentProject)
        _.forEach(CurrentProject, item => {
            const appPath = path.join(microAppPath, `./${item.name}`)
            if(!excludes.includes(item.name)){
                childProcess.exec(`yarn start`, { 
                    cwd: appPath
                }, (error, stdout, stderr) => {
                    console.log("callback", error, stdout, stderr)
                })
            }
            if(item.name!=="starter"){
                const projectProxy = createProxyMiddleware({ target: item.url, changeOrigin: true });
                const regExp = new RegExp(`^/${item.name}/.*\.(${proxyFileSuffixList})$`)
                app.use(regExp, projectProxy);
            }
        })
        const mainProjectProxy = createProxyMiddleware({ target: starter.url, changeOrigin: true });
        app.use('*', mainProjectProxy);

        startServer(servicePort);
        if(withoutBrowser){
            return
        }
        open(`http://localhost:${servicePort}`, { app: 'google chrome'})
    })

    const startServer = (servicePort) =>
        app.listen(servicePort, () => console.log(`Console run dev listening on port ${servicePort}!`));

    readyHandler()
}