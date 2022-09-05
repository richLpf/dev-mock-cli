const express = require('express');
const path = require('path')
const childProcess = require('child_process');
const _ = require('lodash')
const logger = require('../utils/logger')

const proxyFileSuffixList = 'js|json|css|png|jpg|gif|map|ico|ttf|woff|svg';

// 构建执行cli build

module.exports = async ({
  projects,
}) => {
  const execPath = process.cwd()
  const configProjectsPath = `${execPath}/projects.json`
  const microAppPath = path.join(execPath, '../')
  // starter 的 project.json
  const configProjects = require(configProjectsPath)

  const { subProjects, starter, port: startPort } = configProjects

  const readyHandler = _.once(() => {
    const CurrentProject = subProjects.filter(item => projects.includes(item.name))
    CurrentProject.unshift(starter)
    console.log("CurrentProject For Build", CurrentProject)

    _.forEach(CurrentProject, item => {
      // 获取实际项目的物理路径
      const appPath = path.join(microAppPath, `./${item.name}`)
      if (item.name !== "starter") {
        childProcess.exec(`yarn build`, {
          cwd: appPath
        }, (error, stdout, stderr) => {
          logger.tip(`Start Building ${item.name} !`);

          console.log("callback", error, stdout, stderr)
        })
      }
    })
  })

  readyHandler()
}