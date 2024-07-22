import fs from 'fs';
import Mock from 'mockjs';
import { NotFoundResponse, ResponseExample, APIFolderResponse } from './response.js';

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
    fs.mkdirSync(filePath, { recursive: true });
    createAPIFile(ResponseExample);
    console.log(chalk.green(`auto create api folder successful: ${filePath}`));
    return true;
  }
};

const createAPIFile = dataJson => {
  let data = JSON.stringify(dataJson || ResponseExample, '', '\t');
  fs.writeFileSync('./mock/api/get.json', data);
};

const restful = ({ app, filePath }) => {
  const result = checkFileExist(filePath, true);
  app.all('*', async (req, res) => {
    if (!result) {
      res.send(APIFolderResponse);
      return;
    }
    const key = req.params[0];
    const method = req.method.toLowerCase();
    const file = `${filePath}${key}/${method}.json`;
    fs.readFile(file, 'utf-8', function (err, data) {
      if (err) {
        res.send(NotFoundResponse);
      } else {
        // TODO:可以固定参数增加筛选，或者写一写过滤函数，引入mock等，重新生成返回数据，更多的模拟返回值
        res.send(Mock.mock(JSON.parse(data)));
      }
    });
  });
};

export default restful;
