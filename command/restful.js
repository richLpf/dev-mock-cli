import { createProxyMiddleware } from 'http-proxy-middleware';
import { getAllAPIPath } from '../utils/index.js';
import { checkFileExist, checkFileExistsAndRespond } from './localRestful.js';
import { fetchAndCreateRoutes } from './swaggerRestful.js';


const restful = async ({ app, filePath, config }) => {
  const { proxyApiUrl, swaggerApi=[] } = config;
  // 如果没有文件，新建example
  checkFileExist(filePath, true)
  const apiList = getAllAPIPath(filePath);
  // 获取本地所有的path，生成本地代理
  // TODO: 无法匹配路由变量参数
  app.all(apiList, async (req, res) => {
    const url = req.path;
    checkFileExistsAndRespond(url, filePath, req, res);
  });

  await fetchAndCreateRoutes({app, swaggerApi});
  
  // 没有本地mock，则读取远程接口
  if (proxyApiUrl) {
    const proxyMiddleware = createProxyMiddleware({
      target: proxyApiUrl,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyRes(proxyRes, req, res) {
        console.log(`[Proxy Response] Status: ${proxyRes.statusCode}, Path: ${req.path}`);
      }
    })
    app.use('*', proxyMiddleware);
  }
};

export default restful;