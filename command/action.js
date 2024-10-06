import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ResponseExample } from './response.js';
import { getAllAction } from '../utils/index.js';
import { generateApi, createAPIFile, fetchAndCreateRoutes } from './localAction.js';


const action = async ({ app, filePath, config }) => {
  // TODO: 配置信息需要统一处理，作为全局使用，type的每个优先级需要确认和逻辑开发
  const { proxyApiUrl, swaggerApi=[] } = config;
  
  // 如果 mock 文件夹不存在，自动创建它
  if (!fs.existsSync(filePath)) {
    createAPIFile(ResponseExample, filePath, 'ActionName.json');
  }

  // 获取所有 action 名称
  const allActions = getAllAction(filePath);
  if (allActions.length === 0) {
    console.warn('No actions found in the mock directory.');
    return;
  }
  
  // Step1: 为每个 action 注册对应的路由
  generateApi(app, filePath, allActions);
  
  // Step2: 获取swagger api json的数据，注册接口
  // 调用 fetchAndCreateRoutes 函数
  await fetchAndCreateRoutes({app, swaggerApi});
  
  // Step3: 获取代理配置并设置代理
  if (proxyApiUrl) {
    app.use('*', createProxyMiddleware({
        target: proxyApiUrl,
        changeOrigin: true,
      })
    );
  }
};

export default action;