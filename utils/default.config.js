export const defaultConfig = {
  port: 9000,
  timeout: 0,
  requestLimit: '50mb',
  cors: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
    'Content-Type': 'application/json;charset=utf-8'
  },
  swaggerApi: ``
};
