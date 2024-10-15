import defaultConfig from '../utils/defaultConfig.js';
import { setHeader } from '../utils/index.js';
export const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
  res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
};

export const timeoutSetting = (req, res, next) => {
  setTimeout(() => {
    next();
  }, defaultConfig.timeout);
};

export const headerSetting = (req, res, next) => {
  Object.keys(defaultConfig.cors).forEach(key => {
    res.header(key, defaultConfig.cors[key]);
  });
  headers.forEach(header => {
    let [key, value] = header.split(':');
    let headerKey = key.trim();
    value = value.trim();
    let newValue = value;
    newValue = setHeader(env, headerKey, value);
    res.header(headerKey, newValue);
  });
  next();
};

// action中间件的转化
export const actionTransfer = (req, res, next) => {
  const { Action } = req.body;
  if (!Action) {
    // 如果请求体中没有 Action，返回 400 错误
    return res.status(400).send({ error: 'Action field is required' });
  }
  // 动态修改请求的 URL，将它转发到 /{Action} 路径
  req.url = `/${Action}`;
  next();
};