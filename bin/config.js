const logSymbols = require('log-symbols');
const mock = require('../command/mock');
const create = require('../command/create');

const commandOptions = [
  {
    command: "create",
    descriptions: "拉取一个项目模版",
    options: {
      name: {
        alias: "n",
        type: "string",
        require: true,
        describe: "项目名称",
      },
    },
    callback: async (argv) => {
      create({name: argv.name})
    }
  },
  {
    command: "dev",
    descriptions: "启动一个本地服务",
    options: {
      projects: {
        alias: "p",
        type: "string",
        require: true,
        describe: "启动的本地项目名称",
      },
      port: {
        alias: "P",
        type: "number",
        default: 3000,
        describe: "选择启动的端口号",
      },
    },
    callback: async (argv) => {
      console.log(logSymbols.success, `dev callback`);
    },
  },
  {
    command: "mock",
    descriptions: "启动一个本地服务，模拟返回接口数据",
    options: {
      type: {
        alias: "t",
        type: "string",
        default: "action",
        describe: "选择API类型",
        choices: ['action', 'restful']
      },
      port: {
        alias: "P",
        type: "number",
        default: 9000,
        describe: "选择启动的端口号",
      },
      create: {
        alias: "c",
        type: "boolean",
        default: false,
        describe: "如果mock目录不存在是否自动创建，默认不自动创建"
      },
    },
    callback: async (argv) => {
      mock({
        ...argv
      })
    },
  }
];

module.exports = commandOptions;