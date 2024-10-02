import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';
import { cors, timeoutSetting } from './command/middleware.js';
import restful from './command/restful.js';
import action from './command/action.js';

// 获取当前文件路径（解决 ESM 模块路径问题）
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 静态资源路径
const staticPath = path.join(__dirname, 'public');

// 表单提交处理函数
const handleFormSubmission = (req, res) => {
  const { name, email } = req.body;
  console.log(`Received form submission: Name=${name}, Email=${email}`);
  res.send(`<h2>Thank you, ${name}! Your email is ${email}</h2>`);
  process.exit(0); // 停止 CLI 工具
};

// 服务器启动日志
const logServerStart = (port, type) => {
  const examples = {
    action: `curl --location --request POST 'http://localhost:${port}' --header 'Content-Type: application/json' --data-raw '{ "Action": "Query" }'`,
    restful: `curl --location --request GET 'http://localhost:${port}/v1/user' --header 'Content-Type: application/json'`,
  };
  logger.success(`Mock API listening on port ${port}!`);
  logger.success(`example: ${examples[type]}`);
};

// 启动服务器
const startServer = (app, port, type) => {
  app.listen(port, () => logServerStart(port, type));
};

// 模拟服务器
const mock = ({ port, type }) => {
  const app = express();
  const filePath = path.join(process.cwd(), './mock');

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.static(staticPath));

  // 渲染 HTML 表单页面
  app.get('/monto/docs', (req, res) => res.sendFile(path.join(staticPath, 'index.html')));
  
  // 处理表单提交
  app.post('/submit', handleFormSubmission);

  // 通用中间件
  app.all('*', cors);
  app.all('*', timeoutSetting);

  // 根据类型加载相应模块
  const loadModule = type === 'action' ? action : restful;
  loadModule({ app, filePath });

  startServer(app, port, type);
};

export default mock;