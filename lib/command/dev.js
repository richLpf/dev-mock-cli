const express = require('express');
const path = require('path')
const fs = require('fs')
const open = require('open')
const proxy = require('http-proxy-middleware')
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
    env
}) => {

    console.log("project", projects, port, env)
    let remoteHostAppOrigin = HOST_APP_ORIGIN_MAP[env.FRONTEND_ENV] || HOST_APP_ORIGIN_MAP['prod']
    console.log("remoteHostAppOrigin", remoteHostAppOrigin)
        // hostAppOrigin = remoteHostAPPOrigin,
        // localHostAppOrigin,
        // localStarter;

    let servicePort = 4000

    const app = express();

    const readyHandler = _.once(async () => {
        app.get('*', async(req, res) => {
            const html = `<div>html内容</div>`
            res.send(html)
        })
        startServer();
        open(`http://localhost:${servicePort}`, { app: 'google chrome'})
    })

    const finalProjects = getProjectList(projects, []);
    console.log('finalProjects', finalProjects)

    finalProjects.forEach(async projectOptions => {
        const { projectPath, project } = projectOptions;
        const projectPort = (port = await getIdlePort(port + 1))
        console.log("projectPort", projectPort)

    })

    const runDev = ({ dev, project, parentProject, port, projectPath }) => {
        const createProxy = _.once(({port, prefix}) => {
            const projectOrigin = `http://localhost:${port}`;
            const projectProxy = proxy({target: projectOrigin, changeOrigin: true});
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