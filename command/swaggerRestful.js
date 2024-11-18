import SwaggerParser from 'swagger-parser';
import Mock from 'mockjs';

const loadSwaggerDoc = async (filePath) => {
    const api = await SwaggerParser.parse(filePath);
    return api;
};

// 解析 $ref 的函数
const resolveRef = (ref, openAPIDoc) => {
    const parts = ref.replace(/^#\//, '').split('/');
    let current = openAPIDoc;
  
    for (const part of parts) {
      current = current[part];
    }
    
    return current;
};

// 生成 Mock 值的示例函数
const generateMockValue = (schema, openAPIDoc) => {
    if (!schema) return null;
    if (schema.$ref) {
        // 解析 $ref 并递归处理
        const resolvedSchema = resolveRef(schema.$ref, openAPIDoc);
        return generateMockValue(resolvedSchema, openAPIDoc);
    }
    switch (schema.type) {
      case 'string':
        return Mock.mock('@string(5, 10)');
      case 'number':
        return  Mock.mock('@integer(0, 1)');
      case 'integer':
        return  Mock.mock('@integer(0, 1)');
      case 'boolean':
        return true;
      case 'array':
        return [generateMockValue(schema.items, openAPIDoc)];
      case 'object':
        const mockObject = {};
        for (const [key, value] of Object.entries(schema.properties)) {
          mockObject[key] = generateMockValue(value, openAPIDoc);
        }
        return mockObject;
      default:
        return null;
    }
};

// 生成 Mock 数据
const generateMockData = (api) => {
    const mockData = {};
    for (const [path, methods] of Object.entries(api.paths)) {
        if (!mockData[path]) {
            mockData[path] = {}; // 为每个路径初始化一个空对象来存储不同的方法
        }

        for (const [method, details] of Object.entries(methods)) {
            if (['get', 'post', 'put', 'delete'].includes(method.toLowerCase())) {
                const mockEntry = {
                    method,
                    parameters: {},
                    response: {}
                };
      
                // 处理参数
                if (details.parameters) {
                    details.parameters.forEach(param => {
                        if (param.$ref) {
                            const refPath = param.$ref.split('/').pop(); // 提取引用的参数名
                            mockEntry.parameters[refPath] = generateMockValue(api.components.parameters[refPath], api);
                        } else {
                            mockEntry.parameters[param.name] = generateMockValue(param, api);
                        }
                    });
                }
      
                // 处理响应
                if (details.responses) {
                    const response = details.responses['200'];
                    if (response && response.content && response.content['application/json']) {
                        mockEntry.response = generateMockValue(response.content['application/json'].schema, api);
                    }
                }
      
                // 将方法添加到路径下
                mockData[path][method.toLowerCase()] = mockEntry;
            }
        }
    }

    return mockData;
};

// swagger生成路由
export const createRoutes = ({ app, data }) => {
    const mockData = generateMockData(data);

    // 遍历 mockData 并设置 API 路由
    for (const [path, methods] of Object.entries(mockData)) {
        for (const [method, { response }] of Object.entries(methods)) {
            // 处理 POST 请求
            if (method === 'post') {
                app.post(path, (req, res) => {
                    console.log('Received POST request:', req.body);
                    res.json(response);
                });
            }
            // 处理 GET 请求
            else if (method === 'get') {
                app.get(path, (req, res) => {
                    console.log('Received GET request:', req.query);
                    res.json(response);
                });
            }
            // 处理 PUT 请求
            else if (method === 'put') {
                app.put(path, (req, res) => {
                    console.log('Received PUT request:', req.body);
                    res.json(response);
                });
            }
            // 处理 DELETE 请求
            else if (method === 'delete') {
                app.delete(path, (req, res) => {
                    console.log('Received DELETE request:', req.body);
                    res.json(response);
                });
            }
        }
    }
};

// 获取swagger api json的数据，注册接口
export const fetchAndCreateRoutes = async ({ app, swaggerApi }) => {
    const routePromises = swaggerApi.map(async (url) => {
        try {
          const data = await loadSwaggerDoc(url);
          createRoutes({ app, data });
        } catch (error) {
          console.error('Error fetching data from URL:', url, error);
        }
    });
  
    // 等待所有的请求完成
    await Promise.all(routePromises);
};