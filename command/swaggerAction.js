import Mock from 'mockjs';
// 根据swagger response返回mock数据
// 动态生成 Mock 数据的函数

export const getRefModal = ({
    ref,
    definitions
}) => {
    if(!ref) return null;
    const refKey = ref.split('/').pop();
    const responseModal = definitions[refKey];
    if (responseModal) {
        return generateMockData(responseModal, definitions)
    } else {
        console.warn(`Definition not found for ${refKey}`);
    }
}

export const generateMockData = (response, definitions) => {
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
                mockData[key] = Mock.mock('@integer(0, 1)'); // 随机整数
                break;
            case 'number':
                mockData[key] = Mock.mock('@integer(0, 1)'); // 随机整数
                break;
            case 'array':
                mockData[key] = getRefModal({ref: property.items['$ref'], definitions}) || [];
                break;
            case 'object':
                console.log("key1111", key, property)
                mockData[key] = generateMockData(property, definitions)
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

export const createSwaggerMockData = async (data, response) => {
    // 生成 Mock 数据
    const mockData = generateMockData(response, data.definitions);
    // 打印生成的 Mock 数据
    return mockData
}