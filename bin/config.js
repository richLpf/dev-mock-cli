import mock from '../index.js';

export const commandOptions = [
  {
    command: 'mock',
    descriptions: '启动一个本地服务，模拟返回接口数据',
    options: {
      type: {
        alias: 't',
        type: 'string',
        default: 'restful',
        describe: '选择API类型',
        choices: ['restful', 'action']
      },
      port: {
        alias: 'P',
        type: 'number',
        default: 9000,
        describe: '选择启动的端口号'
      },
      create: {
        alias: 'c',
        type: 'boolean',
        default: false,
        describe: '如果mock目录不存在是否自动创建，默认不自动创建'
      }
    },
    callback: async argv => {
      mock({
        ...argv
      });
    }
  }
];
