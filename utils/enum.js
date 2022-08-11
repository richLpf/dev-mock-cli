const DEV_DEPENDENCES_PACKAGE_NAME = '@ucloud/console-dev-dependences';
const TYPE_PACKAGE_NAME = '@ucloud/console-types';
const REGISTRY_URL = 'http://registry.npm.pre.ucloudadmin.com';

module.exports = {
  DEV_DEPENDENCES_PACKAGE_NAME,
  vue: "https://github.com/luchx/ECHI_VUE_CLI3.0.git",
  react: "git@github.com:richLpf/antd-template-demo.git#main",
  HOST_APP: "rapiop-demo",
  HOST_APP_ORIGIN_MAP: {
    pre: 'http://localhost:9000',
    pre2: 'http://localhost:9001',
    prod: 'http://localhost:9000'
  },
  TYPE_PACKAGE_NAME,
  REGISTRY_URL,
  isWindows: process.platform === 'win32'
};
