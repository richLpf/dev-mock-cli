import express from 'express';
import path from 'path';
import cors from 'cors';

import { timeoutSetting, actionTransfer } from './command/middleware.js';
import restful from './command/restful.js';
import action from './command/action.js';
import { ConfirmPort } from './utils/prompt.js';
import { getIdlePort } from './utils/index.js';
import { logServerStart, handleFormSubmission } from './utils/serverUtils.js';

class MockServer {
  constructor(config) {
    this.config = config;
    this.port = config.port;
    this.type = config.type;
    this.staticPath = path.join(process.cwd(), 'public');
    this.filePath = path.join(process.cwd(), './mock');
  }

  // 启动服务器
  async start() {
    const newPort = await getIdlePort(this.port);
    let confirmPortResult = true;

    if (this.port !== newPort) {
      confirmPortResult = await ConfirmPort(this.port, newPort);
      if (confirmPortResult) {
        this.port = newPort;
      } else {
        console.error('The current port is occupied and the service cannot be started.');
        process.exit(0);
      }
    }

    const app = express();
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.static(this.staticPath));

    app.get('/monto/docs', (req, res) => res.sendFile(path.join(this.staticPath, 'index.html')));
    app.post('/submit', handleFormSubmission);

    // 通用中间件
    app.use(cors());
    app.use('*', timeoutSetting);
    if (this.type === 'action') {
      app.all('*', actionTransfer);
    }

    // 根据类型加载模块
    const loadModule = this.type === 'action' ? action : restful;
    loadModule({ app, filePath: this.filePath, config: this.config });

    this.startServer(app);
  }

  // 启动Express服务器并打印启动日志
  startServer(app) {
    app.listen(this.port, () => logServerStart(this.port, this.type));
  }
}

export default MockServer;