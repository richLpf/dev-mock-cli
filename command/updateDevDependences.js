const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const _ = require('lodash');

const logger = require('../utils/logger');
const config = require('../utils/enum');
const { getLatestVersion, getPackageUrl, isNewerVersion } = require('../utils/lib');

module.exports = ({ projects, devDependencesUrl, packageManager, noSave }) => {
    logger.tip(`project and devDependencesUrl,${projects[0].project},${projects[0].projectPath},${devDependencesUrl},${packageManager},${noSave}`)
    if (devDependencesUrl) {
        logger.warn(`Update dev-dependences from url: ${devDependencesUrl}`);
    }

    let latestStdLabel = null;
    let customLogger = (label, type, msg) => {
        if (label !== latestStdLabel) {
            latestStdLabel = label;
            logger.label(latestStdLabel);
        }
        logger[type](msg);
    };

    const updateDevDependencesForProject = projectOptions => {
        return new Promise((resolve, reject) => {
            const { project, projectPath } = projectOptions;
            const relativeProjectPath = path.relative(process.cwd(), projectPath);
            logger.tip(`Start to update dev-dependences in ${relativeProjectPath} with ${packageManager}`);

            let projectDevDependencesUrl = devDependencesUrl;
            // 无本地依赖包从package.json中读取开发依赖项
            if (!projectDevDependencesUrl) {
                const packagePath = path.resolve(projectPath, 'package.json');
                console.log("projectPath", projectPath)
                if (!fs.existsSync(packagePath)) {
                    return reject(new Error(`There is no package.json in project ${project}`));
                }
                projectDevDependencesUrl = (require(packagePath).devDependencies || {})[
                    config.DEV_DEPENDENCES_PACKAGE_NAME
                ];
                if (!projectDevDependencesUrl) {
                    return reject(
                        new Error(
                            `There is no dev-dependences in your package.json devDependences in project ${project}`
                        )
                    );
                }
                const projectDevDependencesPath = path.join(
                    projectPath,
                    'node_modules',
                    config.DEV_DEPENDENCES_PACKAGE_NAME
                );
                const projectDevDependencesPackagePath = path.resolve(projectDevDependencesPath, 'package.json');

                if (!fs.existsSync(projectDevDependencesPackagePath)) {
                    return reject(new Error(`You need to run install for dev-dependences`));
                }
                const projectDevDependencesVersion = require(projectDevDependencesPackagePath).version;
                const latestVersion = getLatestVersion(projectDevDependencesVersion);

                if (latestVersion === projectDevDependencesVersion) {
                    logger.tip(`Is latest version, no need to update`);
                    return resolve();
                }

                if (isNewerVersion(projectDevDependencesVersion, latestVersion)) {
                    logger.tip(`Is newer than latest version, no need to update`);
                    return resolve();
                }
                projectDevDependencesUrl = getPackageUrl(latestVersion);
            }
            // 更新开发依赖包为最新
            let command = `yarn add ${projectDevDependencesUrl} --dev${noSave ? ' --no-lockfile --no-save' : ''}`;
            if (packageManager !== 'yarn') {
                command = `${packageManager} install ${projectDevDependencesUrl} --save-dev${
                    noSave ? ' --no-package-lock --save=false' : ''
                }`;
            }

            let msgCache = [];
            const _log = _.debounce(() => {
                customLogger(`${project} stdout`, 'log', msgCache.join(''));
                msgCache = [];
            }, 1000);
            const log = msg => {
                msgCache.push(msg + '');
                _log();
            };

            command = command.split(' ');
            const update = child_process.spawn(command.shift(), command, {
                cwd: projectPath,
                shell: config.isWindows
            });
            update.stdout.on('data', data => {
                log(data);
            });
            update.stderr.on('data', data => {
                customLogger(`${project} stderr`, 'log', data);
            });
            update.on('error', err => {
                customLogger(`${project} error`, 'error', err);
            });
            update.on('close', code => {
                if (code !== 0) {
                    reject(new Error(`Fail with code ${code}`));
                } else {
                    resolve();
                }
            });
        });
    };

    return Promise.all(projects.map(project => updateDevDependencesForProject(project)));
};
