import path from 'path';
import fs from 'fs';
import Mock from 'mockjs';
import { ResponseExample, NotFoundResponse } from './response.js';
// import axios from 'axios';
// import { createSwaggerMockData } from './swaggerAction.js'
export const createAPIFile = (dataJson, folderPath, fileName) => {
    const apiFolderPath = path.resolve(folderPath);  // 定义 API 目录的绝对路径
    const filePath = path.resolve(apiFolderPath, fileName);  // 定义 get.json 文件的绝对路径
    
    // 递归创建目录，确保 mock/api 文件夹存在
    if (!fs.existsSync(apiFolderPath)) {
      fs.mkdirSync(apiFolderPath, { recursive: true });
    }
    
    const data = JSON.stringify(dataJson || ResponseExample, null, 2);
    fs.writeFileSync(filePath, data);
    console.log(`File created at: ${filePath}`);
  };
  
export const generateApi = (app, filePath, actions) => {
    actions.forEach(action => {
      app.use(`/${action}`, async (req, res) => {
        const { Action } = req.body;
        const actionFile = path.join(filePath, `${Action}.json`);
        if (!fs.existsSync(actionFile)) {
          return res.status(404).send(NotFoundResponse);
        }
        
        fs.readFile(actionFile, 'utf-8', (err, data) => {
          if (err) {
            console.error(`Error reading file: ${actionFile}`, err);
            return res.status(404).send(NotFoundResponse);
          }
          try {
            const mockData = Mock.mock(JSON.parse(data));
            res.send(mockData);
          } catch (parseError) {
            console.error(`Error parsing JSON from file: ${actionFile}`, parseError);
            return res.status(500).send({ error: 'Invalid JSON format' });
          }
        });
      });
    });
  }