import path from 'path';
import fs from 'fs';

const configName = 'mock.config.js';
const defaultConfig = {
  proxyApiUrl: '',
};

const getConfig = () => {
  const configPath = path.join(process.cwd(), configName);

  let mock = {};
  let template = {};
  if (fs.existsSync(configPath)) {
    const config = require(configPath);
    mock = config.mock;
    template = config.template;
  }

  return {
    ...defaultConfig,
    ...mock,
  };
};

module.exports = getConfig;
