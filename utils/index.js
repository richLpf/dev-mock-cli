import fs from 'fs';
import path from 'path';
import ora from 'ora';
import getPort, { portNumbers } from 'get-port';
import { ResponseExample } from '../command/response.js'

export const checkFileExist = () => {
  return fs.existsSync(path.join(process.cwd(), `./mock`));
};

export const createMkdir = () => {
  if (!checkFileExist()) {
    fs.mkdir(`mock`, function (err) {
      if (err) {
        return console.error(err.message);
      }
      fs.mkdirSync(`./mock/api`);
    });
  }
};

export const setHeader = (env, headerKey, value) => {
  let newValue = value;
  switch (headerKey) {
    case 'Access-Control-Allow-Headers':
      newValue = `${env.cors['Access-Control-Allow-Headers']}, ${value}`;
      break;
    case 'Access-Control-Allow-Methods':
      newValue = `${env.cors['Access-Control-Allow-Methods']}, ${value}`;
      break;
    case 'Content-Type':
      newValue = value;
      break;
  }
  return newValue;
};

export const getIdlePort = async (defaultPort) => {
  return await getPort({
    port: portNumbers(defaultPort, defaultPort + 1)
  });
}

export const getAllAPIPath = (filePath) => {
  const apiPath = [];

  const walkDir = (currentPath, currentRoute) => {
    const items = fs.readdirSync(currentPath); // 读取当前路径的所有文件和目录
    items.forEach((item) => {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // 递归处理子目录
        walkDir(itemPath, `${currentRoute}/${item}`);
      } else if (item.endsWith('.json')) {
        // 处理 JSON 文件，生成 API 路径
        const route = `${currentRoute}`;
        const cleanedRoute = route.replace(/\\/g, '/'); // 处理路径中的反斜杠
        if (!apiPath.includes(cleanedRoute)) {
          apiPath.push(cleanedRoute);
        }
      }
    });
  };

  walkDir(filePath, ''); // 从给定的文件路径开始递归

  return apiPath;
};

export const getAllAction = (filePath) => {
  const fileList = [];
  try {
    fs.readdirSync(filePath).forEach((fileName) => {
      const name = fileName.substring(0, fileName.lastIndexOf('.'));
      fileList.push(name);
    });
  } catch (err) {
    logger.output.error(err.message);
    return fileList;
  }
  return fileList;
}

export const checkAction = (action, filePath) => {
  if (!action) {
    return false;
  }
  const fileList = getAllAction(filePath);
  if (fileList.includes(action)) {
    return true;
  }
  return false;
}

export const createActionMockData = (filePath) => {
  const spinner = ora('Generating mock data...').start();
  try {
    fs.mkdirSync(`${filePath}`, { recursive: true });
    const data = readJson(path.join(__dirname, 'actionRes.json'));
    Object.keys(data).forEach((key) => {
      let dataJson = JSON.stringify(data[key], '', '\t');
      fs.writeFileSync(`${filePath}/${key}.json`, dataJson);
    });
    spinner.succeed('Generate mock data is success');
  } catch (err) {
    // logger.output.error(err.message);
    spinner.fail(`There is an error: ${err.message}`);
  }
}