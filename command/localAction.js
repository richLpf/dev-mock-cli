import path from 'path';
import fs from 'fs';
import Mock from 'mockjs';
import axios from 'axios';
import { createSwaggerMockData } from './swaggerAction.js'
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
  
  // swagger生成路由
export const createRoutes = ({ app, data }) => {
    const paths = data.paths || {}
    if(!paths){
      return
    }
    const keys = Object.keys(paths);
    const limit = Math.min(keys.length, 100); // 只生成前100个路由
  
    for (let i = 0; i < limit; i++) {
      const pathKey = keys[i];
      const pathInfo = paths[pathKey];
      const lastSegment = `/${pathKey.split('/').pop()}`;
      
      Object.keys(pathInfo).forEach(method => {
        app[method](lastSegment, async (req, res) => {
          const { Action } = req.body;
          if (Action) {
            // TODO: 这里指读取了$ref字段，如果没有关联需要处理下
            const responseSchema = pathInfo[method].responses['200'].schema['$ref'].split('/').pop();
            const response = data.definitions[responseSchema]
            const mockResponse = await createSwaggerMockData(data, response)
            return res.status(200).json(mockResponse);
          } else {
            return res.status(404).send(NotFoundResponse);
          }
        });
      });
    }
  };
  
  // Step3: 获取swagger api json的数据，注册接口
export const fetchAndCreateRoutes = async ({ app, swaggerApiJSON }) => {
    const routePromises = swaggerApiJSON.map(async (item) => {
      const { type, url } = item;
      if (type === 'action') {
        try {
          // TODO: 优化, 全局加载，方便后面读取直接使用
          const response = await axios.get(url);
          const data = response.data;
          createRoutes({ app, data });
        } catch (error) {
          console.error('Error fetching data from URL:', url, error);
        }
      }
    });
  
    // 等待所有的请求完成
    await Promise.all(routePromises);
};