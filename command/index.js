import express from 'express';
import path from 'path';

import logger from '../utils/logger.js';
import { cors, timeoutSetting } from './middleware.js';
import restful from './restful.js';
import action from './action.js';

const mock = args => {
  const { port, type } = args;

  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '50mb' }));
  app.all('*', cors);
  app.all('*', timeoutSetting);

  const filePath = path.join(process.cwd(), `./mock`);

  switch (type) {
    case 'action':
      action({ app, filePath });
      break;
    default:
      restful({ app, filePath });
  }

  const startServer = () => {
    app.listen(port, async () => {
      console.log(`Mock api listening on port ${port}!`);
      switch (type) {
        case 'action':
          logger.success(
            `example: curl --location --request POST 'http://localhost:${port}' --header 'Content-Type: application/json' --data-raw '{ "Action": "Query" }'`
          );
          break;
        case 'restful':
          logger.success(
            `example: curl --location --request GET 'http://localhost:${port}/v1/user' --header 'Content-Type: application/json'`
          );
          break;
      }
    });
  };

  startServer();
};

export default mock;
