const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const config = require('./enum');

const { DEV_DEPENDENCES_PACKAGE_NAME, TYPE_PACKAGE_NAME, REGISTRY_URL } = require('./enum');

const getDistTag = version => {
    const [major] = version.split('.');
    const distTag = ['v-first', 'v-second'][major - 1];
    if (!distTag) throw new Error(`Don't have distTag for version: ${version}`);
    return distTag;
};

let distTagMapCache = null;
const getDistTagVersion = distTag => {
    if (!distTagMapCache) {
        distTagMapCache = {};
        execSync(`npm dist-tag ls ${DEV_DEPENDENCES_PACKAGE_NAME} --registry=${REGISTRY_URL}`)
            .toString()
            .split(/\n/)
            .forEach(str => {
                if (str) {
                    const [distTag, version] = str.split(':');
                    distTagMapCache[distTag.trim()] = version.trim();
                }
            });
    }

    const distTagVersion = distTagMapCache[distTag];
    if (!distTagVersion) throw new Error(`Can't find version for distTag: ${distTag}`);
    return distTagVersion;
};

const getLatestVersion = version => getDistTagVersion(getDistTag(version));

const isNewerVersion = (version, baseVersion) => {
    const [ma, mi, pa] = version.split('.').map(v => +v);
    const [bma, bmi, bpa] = baseVersion.split('.').map(v => +v);
    return ma > bma || (ma === bma && mi > bmi) || (ma === bma && mi === bmi && pa > bpa);
};

const getPackageUrl = version => {
    return `${REGISTRY_URL}/${DEV_DEPENDENCES_PACKAGE_NAME}/download/${DEV_DEPENDENCES_PACKAGE_NAME}-${version}.tgz`;
};

const getTypePackageLastVersion = () => {
    const distTagMapCache = {};
    execSync(`npm dist-tag ls ${TYPE_PACKAGE_NAME} --registry=${REGISTRY_URL}`)
        .toString()
        .split(/\n/)
        .forEach(str => {
            if (str) {
                const [distTag, version] = str.split(':');
                distTagMapCache[distTag.trim()] = version.trim();
            }
        });

    return distTagMapCache['latest'];
};
const getTypePackageUrl = version => {
    return `${REGISTRY_URL}/${TYPE_PACKAGE_NAME}/download/${TYPE_PACKAGE_NAME}-${version}.tgz`;
};

const getProjectDevDependencesVersionInfo = (projectPath) => {
    const projectDevDependencesPath = path.join(
        projectPath,
        'node_modules',
        config.DEV_DEPENDENCES_PACKAGE_NAME
    );
    const projectDevDependencesPackagePath = path.resolve(projectDevDependencesPath, 'package.json');

    if (!fs.existsSync(projectDevDependencesPackagePath)) {
        throw new Error(`You need to run install for dev-dependences`);
    }
    const projectDevDependencesVersion = require(projectDevDependencesPackagePath).version;
    const [major, minor, patch] = projectDevDependencesVersion.split('.').map(v => +v);
    return {
        major,
        minor,
        patch,
        version: projectDevDependencesVersion,
        distTag: getDistTag(projectDevDependencesVersion)
    }
}

module.exports = {
    getDistTag,
    getDistTagVersion,
    getLatestVersion,
    getPackageUrl,
    isNewerVersion,
    getTypePackageUrl,
    getTypePackageLastVersion,
    getProjectDevDependencesVersionInfo
};
