import { createProxyMiddleware } from 'http-proxy-middleware';
import { getConfig } from '../utils/config.js';
import { getAllAPIPath } from '../utils/index.js';
import { checkFileExist, checkFileExistsAndRespond } from './localRestful.js';


const restful = async ({ app, filePath }) => {
  // 如果没有文件，新建example
  checkFileExist(filePath, true)
  console.log(filePath)
  const apiList = getAllAPIPath(filePath);
  // 获取本地所有的path，生成本地代理
  app.all(apiList, async (req, res) => {
    const url = req.path;
    checkFileExistsAndRespond(url, filePath, req, res);
  });
  // 没有本地mock，则读取远程接口
  const { proxyApiUrl } = await getConfig();
  if (proxyApiUrl) {
    const proxyMiddleware = createProxyMiddleware({
      target: proxyApiUrl,
      changeOrigin: true,
    })
    app.use('*', proxyMiddleware);
  }
};

export default restful;