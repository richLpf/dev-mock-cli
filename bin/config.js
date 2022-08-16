const logSymbols = require('log-symbols');
const mock = require('../command/mock');
const create = require('../command/create');
const dev = require('../command/dev');

const getEnvConfig = development => {
  return {
      env: {
          alias: 'e',
          type: 'object',
          describe: `${development ? '开发' : '构建'}的自定义环境变量`,
          describeEN: `Env for ${development ? 'dev' : 'build'}`
      },
      FRONTEND_ENV: {
          alias: ['f', 'env.FRONTEND_ENV'],
          type: 'string',
          default: development ? 'prod' : undefined,
          choices: ['pre', 'pre2', 'test03', 'prod', 'runtime'],
          describe: '选择前端的环境（文件、语言等）',
          describeEN: 'Env of frontend'
      },
      BACKEND_ENV: {
          alias: ['b', 'env.BACKEND_ENV'],
          type: 'string',
          default: development ? 'prod' : undefined,
          choices: ['pre', 'pre2', 'test03', 'prod', 'runtime'],
          describe: '选择后端的环境（API 环境）',
          describeEN: 'Env of backend'
      }
  };
};

const getCleanEnv = (env, development) => {
  const newEnv = {};
  const envConfig = getEnvConfig(development);
  delete envConfig.env;

  for (const key in env) {
      if (key in envConfig) {
          newEnv[key] = env[key];
      } else if (!(key.toLowerCase() in envConfig) && !(key.toUpperCase() in envConfig)) {
          newEnv[key] = env[key];
      }
  }

  return newEnv;
};

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
        type: "array",
        require: true,
        describe: "启动的本地项目名称",
      },
      excludes: {
        alias: "ex",
        type: "array",
        describe: "挂载的项目，自行启动",
      },
      front: {
        alias: "f",
        type: "string",
        require: true,
        describe: "本地环境",
      },
      backend: {
        alias: "b",
        type: "string",
        require: true,
        describe: "后端环境",
      },
      port: {
        type: "number",
        default: 3000,
        describe: "选择启动的端口号",
      },
      withoutBrowser: {
          alias: ["wb"],
          type: "boolean",
          default: false,
          describe: "默认自动开启浏览器",
      },
      config: {
        alias: "c",
        type: "string",
        default: "./projects.json",
        describe: "默认项目根目录",
      },
      ...getEnvConfig(true)
    },
    callback: async (argv) => {
      console.log(logSymbols.success, `dev callback`);
      dev({ 
        ...argv,
        env: getCleanEnv(argv.env, true)
      })
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