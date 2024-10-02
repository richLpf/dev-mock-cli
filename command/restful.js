import fs from 'fs';
import path from 'path';
import Mock from 'mockjs';
import chalk from 'chalk';
import { NotFoundResponse, ResponseExample, APIFolderResponse } from './response.js';

// 检查文件夹是否存在，如果不存在就自动创建
const checkFileExist = (filePath, autoCreate = false) => {
  const mkdirExist = fs.existsSync(filePath);
  if (mkdirExist) {
    return true;
  }
  if (!fs.existsSync(filePath) && !autoCreate) {
    console.log(
      'The current directory mock folder does not exist, you can create it use : ' + chalk.red('u-admin-cli mock -n')
    );
    return false;
  } else {
    fs.mkdirSync(filePath, { recursive: true });  // 使用 mkdirSync 保证同步执行，不需要回调函数
    createAPIFile(ResponseExample, filePath);  // 将路径传入创建文件函数
    console.log(chalk.green(`Auto create API folder successful: ${filePath}`));
    return true;
  }
};

// 确保目录存在，并创建API文件
const createAPIFile = (dataJson, folderPath) => {
  const apiFolderPath = path.resolve(folderPath, 'api');  // 定义 API 目录的绝对路径
  const filePath = path.resolve(apiFolderPath, 'get.json');  // 定义 get.json 文件的绝对路径

  // 递归创建目录，确保 mock/api 文件夹存在
  if (!fs.existsSync(apiFolderPath)) {
    fs.mkdirSync(apiFolderPath, { recursive: true });
  }

  const data = JSON.stringify(dataJson || ResponseExample, null, '\t');
  fs.writeFileSync(filePath, data);
  console.log(`File created at: ${filePath}`);
};

// 读取并返回数据
const restful = ({ app, filePath }) => {
  const result = checkFileExist(filePath, true);

  app.all('*', async (req, res) => {
    if (!result) {
      res.send(APIFolderResponse);
      return;
    }

    const key = req.params[0];
    const method = req.method.toLowerCase();
    const file = path.resolve(filePath, key, `${method}.json`);  // 使用绝对路径

    fs.readFile(file, 'utf-8', function (err, data) {
      if (err) {
        res.send(NotFoundResponse);
      } else {
        res.send(Mock.mock(JSON.parse(data)));
      }
    });
  });
};

export default restful;