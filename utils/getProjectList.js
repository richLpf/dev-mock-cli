const path = require('path')
const fs = require('fs')
const _ = require('lodash')

module.exports = (projects, nProjects=[]) => {
    const finalProjects = [];
    projects.forEach(project => {
        const projectPath = path.join(process.cwd(), "../", project);
        const projectConfigPath = path.join(projectPath, '.console/config.js');
        const projectConfig = fs.existsSync(projectConfigPath) ? require(projectConfigPath) : null;

        // console.log("projectConfig", project, projectPath, projectConfig)

        if (projectConfig && projectConfig.subProjects) {
            _.each(projectConfig.subProjects, (subProjectPath, subProject) => {
                finalProjects.push({
                    project: subProject,
                    projectPath: subProjectPath,
                    parentProject: project
                });
            });
        } else {
            finalProjects.push({
                project,
                projectPath
            });
        }

    })
    return finalProjects
}