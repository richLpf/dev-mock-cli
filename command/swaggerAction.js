import Mock from 'mockjs';
import axios from 'axios';
import { NotFoundResponse } from './response.js';

// const RuleMap = {
//     NameRule: 'name',
//     MailRule: 'mail',
//     IdIntRule: 'id',
//     TimeRule: 'time'
// }


// swagger生成路由
export const createRoutes = ({ app, data, config }) => {
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
            const mockResponse = await createSwaggerMockData(data, response, config)
            return res.status(200).json(mockResponse);
          } else {
            return res.status(404).send(NotFoundResponse);
          }
        });
      });
    }
};
  
// 获取swagger api json的数据，注册接口
export const fetchAndCreateRoutes = async ({ app, swaggerApi, config }) => {
    const routePromises = swaggerApi.map(async (url) => {
        try {
          // TODO: 优化, 全局加载，方便后面读取直接使用
          const response = await axios.get(url);
          const data = response.data;
          createRoutes({ app, data, config });
        } catch (error) {
          console.error('Error fetching data from URL:', url, error);
        }
    });
  
    // 等待所有的请求完成
    await Promise.all(routePromises);
};

export const getRefModal = ({
    ref,
    definitions,
    config
}) => {
    if(!ref) return null;
    const refKey = ref.split('/').pop();
    const responseModal = definitions[refKey];
    if (responseModal) {
        return generateMockData(responseModal, definitions, config)
    } else {
        console.warn(`Definition not found for ${refKey}`);
    }
}

export const generateMockData = (response, definitions, config) => {
    const mockData = {};
    const { type, properties } = response;
    if(type === 'object'){
        // 遍历 response 的 properties
        for (const key in properties) {
            const property = response.properties[key];
            switch (property.type) {
            case 'string':
                mockData[key] = Mock.mock('@string(5, 10)'); // 随机字符串
                break;
            case 'integer':
                // 增加固定参数返回RetCode=0
                mockData[key] = ["RetCode", "ret_code"].includes(key) ? 0 : Mock.mock('@integer(1, 10)'); // 随机整数
                break;
            case 'number':
                mockData[key] = ["RetCode", "ret_code"].includes(key) ? 0 : Mock.mock('@integer(1, 10)'); // 随机整数
                break;
            case 'boolean':
                mockData[key] = true; // 随机布尔值
                break;
            case 'array':
                mockData[key] = getRefModal({ref: property.items['$ref'], definitions, config}) || [];
                break;
            case 'object':
                mockData[key] = generateMockData(property, definitions, config)
                break;
            default:
              if(property['$ref']){
                mockData[key] = getRefModal({
                    ref: property['$ref'], 
                    definitions
                  }) || null
              }else if(property.allOf){
                mockData[key] = getRefModal({
                    ref: property.allOf[0]['$ref'], 
                    definitions
                  }) || null
              }
            }
        }
    }
    return mockData;
};

export const createSwaggerMockData = async (data, response, config) => {
    // 生成 Mock 数据
    const definitions = data?.definitions || data.components?.schemas;
    const mockData = generateMockData(response, definitions, config);
    // 打印生成的 Mock 数据
    return mockData
}

// export const responseRule = ({rules, key}) => {
//     if(Object.keys(rules).includes(key)){
//         if('fixedValue' in rule[key]){
//             // 固定值
//             return rule[key].fixedValue
//         }
//     }
// }