import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import logger from './logger.js';

// Get the current module directory
export const getDirname = (moduleUrl) => {
  return path.dirname(fileURLToPath(moduleUrl));
};

// Get cli version
export const getVersion = async () => {
  const __dirname = getDirname(import.meta.url);
  const data = await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8');
  const { version } = JSON.parse(data);
  return version;
};

// 表单提交处理函数
export const handleFormSubmission = (req, res) => {
  const { name, email } = req.body;
  console.log(`Received form submission: Name=${name}, Email=${email}`);
  res.send(`<h2>Thank you, ${name}! Your email is ${email}</h2>`);
  process.exit(0); // 停止 CLI 工具
};

// 打印服务器启动日志
export const logServerStart = async (port, type) => {
  const version = await getVersion();
  const introduction = {
    welcome: `Welcome to dev-mock-cli: ${version}`,
    document: `3. For more info, check out: https://github.com/richLpf/dev-mock-cli/wiki/dev%E2%80%90mock%E2%80%90cli`,
    api: `Mock API running on port ${port}, using ${type} style.`,
    order: `1. API lookup order: local mock -> swagger -> remote API`,
    actionExample: `2. Example (Action API): curl --location --request POST 'http://localhost:${port}' --header 'Content-Type: application/json' --data-raw '{ "Action": "ActionName" }'`,
    restfulExample: `2. Example (RESTful API): curl --location --request GET 'http://localhost:${port}/user' --header 'Content-Type: application/json'`,
  };

  logger.tip(introduction.welcome);
  logger.tip(introduction.order);
  
  if (type === 'action') {
    logger.tip(introduction.actionExample);
  } else if (type === 'restful') {
    logger.tip(introduction.restfulExample);
  }
  logger.tip(introduction.document);
  logger.tip(introduction.api);
};

// Read the config file
export const readConfigFile = async (configPath) => {
  try {
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading config file:", error);
    return {}; // Return an empty object if an error occurs
  }
};

// Check if the file exists
export const fileExists = async (configPath) => {
  try {
    await fs.access(configPath);
    return true;
  } catch (error) {
    console.error("File does not exist:", error)
    return false;
  }
};

// Check URL accessibility
export const checkUrlAccessibility = async (url) => {
  try {
    const response = await axios.get(url); // Use fetch or axios
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    logger.error(`Error accessing URL: ${url}`);
    logger.error(error);
    return false;
  }
};

// Validate port
export const validatePort = (port) => {
  const portNumber = Number(port);
  if (isNaN(portNumber) || portNumber < 0 || portNumber > 65535) {
    logger.error(`Invalid port number: ${port}. Using default port.`);
    return null; // Return null to indicate an invalid port
  }
  return portNumber; // Return valid port number
};

// Validate type
export const validateType = (type) => {
  const validTypes = ['action', 'restful'];
  if (!validTypes.includes(type)) {
    logger.error(`Invalid type: ${type}. Using default type.`);
    return null; // Return null to indicate an invalid type
  }
  return type; // Return valid type
};