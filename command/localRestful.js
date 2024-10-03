import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import Mock from 'mockjs';
import { mockRestfulAPI, ResponseExample, NotFoundResponse } from './response.js'

// 确保目录存在，并创建API文件
const createAPIFile = (dataJson, folderPath, fileName) => {
    const apiFolderPath = path.resolve(folderPath);  // 定义 API 目录的绝对路径
    const filePath = path.resolve(apiFolderPath, fileName);  // 定义 get.json 文件的绝对路径
    // 递归创建目录，确保 mock/api 文件夹存在
    if (!fs.existsSync(apiFolderPath)) {
      fs.mkdirSync(apiFolderPath, { recursive: true });
    }
    
    const data = JSON.stringify(dataJson || ResponseExample, null, '\t');
    fs.writeFileSync(filePath, data);
    console.log(`File created at: ${filePath}`);
};

// 创建多个 API 文件
export const createMultipleAPIFiles = (apiArray, basePath) => {
    apiArray.forEach(item => {
      const filePath = path.join(basePath, item.url);
      createAPIFile(item.content, filePath, item.fileName);
    });
};
  
  // 检查文件夹是否存在，如果不存在就自动创建
export const checkFileExist = (filePath, autoCreate = false) => {
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
      createMultipleAPIFiles(mockRestfulAPI, filePath);
      console.log(chalk.green(`Auto create API folder successful: ${filePath}`));
      return true;
    }
};

// 替换url中的变量为占位符,
// /user/1 -> /user/{id}、
// /user/12/23 -> /user/12/23 | /user/{id}/23 | /user/12/{id}
/* url中第一个/user不变，
1、先精准匹配，
2、依次将每一个替换成变量{id}，先替换1个，再2个...
3、只到所有的替换成{id},每次替换完成后，读取上面的文件目录是否存在，如果存在则读取,终止，不存在则继续替换，都没有则返回404
*/
const replaceUrlWithPlaceholders = (url, placeholder = '{id}') => {
    const parts = url.split('/').filter(Boolean);
    const patterns = [];
  
    // 1. 精确匹配
    patterns.push(url);
    
    // 2. 依次将每个部分替换成变量{id}
    for (let i = 1; i <= parts.length; i++) {
      for (let j = 0; j < parts.length; j++) {
        const currentPattern = [...parts];
        if (j < i) {
          currentPattern[j] = placeholder; // 替换为占位符
        }
        patterns.push(currentPattern.join('/'));
      }
    }
  
    return patterns;
};
  
export const checkFileExistsAndRespond = (url, filePath, req, res) => {
    const patterns = replaceUrlWithPlaceholders(url);
    for (const pattern of patterns) {
      const method = req.method.toLowerCase();
      const fileToLoad = path.join(filePath, `${pattern}/${method}.json`);
  
      if (fs.existsSync(fileToLoad)) {
        fs.readFile(fileToLoad, 'utf-8', (err, data) => {
          if (err) {
            res.send(NotFoundResponse);
          } else {
            res.send(Mock.mock(JSON.parse(data)));
          }
        });
        return; // 成功读取后终止
      }
    }
    // 如果没有匹配到任何文件
    res.send(NotFoundResponse);
};