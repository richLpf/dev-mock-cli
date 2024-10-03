import path from 'path';
import fs from 'fs/promises'; // 使用 fs/promises 以支持异步读取
import { fileURLToPath } from 'url';

const configName = 'mock.config.json';
const defaultConfig = {
  proxyApiUrl: 'http://localhost:3000',
};

export const getConfig = async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url)); // 获取当前模块目录
  const configPath = path.join(__dirname, '..', configName); // 指向根目录
  console.log("configPath", configPath)
  
  let mock = {};
  try {
    const data = await fs.readFile(configPath, 'utf-8');
    mock = JSON.parse(data);
    console.log("mock", mock)
  } catch (error) {
    console.error("Error reading config file:", error);
  }

  return {
    ...defaultConfig,
    ...mock,
  };
};