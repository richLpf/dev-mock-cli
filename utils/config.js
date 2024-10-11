import path from 'path';
import defaultConfig from './defaultConfig.js';
import logger from './logger.js';
import {
  readConfigFile,
  fileExists,
  checkUrlAccessibility,
  validatePort,
  validateType
} from './serverUtils.js';

class ConfigManager {
  constructor(configName = 'mock.config.json') {
    this.configName = configName;
    this.defaultConfig = defaultConfig;
  }

  // Get the path to the config file
  getConfigPath() {
    return path.join(process.cwd(), this.configName);
    // return path.join(getDirname(import.meta.url), '..', this.configName); // Pointing to the root directory
  }

   // Filter out invalid JSON URLs
   async filterInvalidJsonUrl(config) {
    if (config.swaggerApi) {
      // Create an array containing all URLs
      const urlList = config.swaggerApi.map(item => item.url);
      
      // Check the accessibility of all URLs
      const urlAccessResults = await Promise.all(urlList.map(async url => {
        const isAccessible = await checkUrlAccessibility(url);
        return { url, isAccessible };
      }));
  
      // Filter out accessible URLs
      const validSwaggerApi = urlAccessResults
        .filter(result => result.isAccessible)
        .map(result => config.swaggerApi.find(item => item.url === result.url));
  
      // Return the list of valid swaggerApi
      config.swaggerApi = validSwaggerApi; 
    }
    return config;
  }

  // Initialize parameters, converting Action and Restful to lowercase
  normalizeApiType(config) {
    if (config.port) {
      config.port = validatePort(config.port) || defaultConfig.port;
    }else{
      config.port = defaultConfig.port;
    }
    if (config.type) {
      config.type = validateType(config.type) || defaultConfig.type;
    }else{
      config.type = defaultConfig.type;
    }
    return config;
  }

  configBasedConfig({ mock, type, port }) {
    return {
      ...mock,
      ...(type && { type }),
      ...(port && { port }),
    };
  }

  // Main function to get the configuration
  async getConfig(commandArgs) {
    const { type, port } = commandArgs;
    const configPath = this.getConfigPath();
    let mock = {};

    // First, check if the file exists; if not, use default values
    const fileExistsResult = await fileExists(configPath);
    if (fileExistsResult) {
      mock = await readConfigFile(configPath);

      // Check if proxyApiUrl and swaggerApi are configured, and validate network connectivity
      if (mock.proxyApiUrl) {
        const proxyAccessible = await checkUrlAccessibility(mock.proxyApiUrl);
        if (!proxyAccessible) {
          logger.error(`Error accessing URL: ${mock.proxyApiUrl}`);
          delete mock.proxyApiUrl; // Remove inaccessible configuration
        }
      }
      // Remove inaccessible URLs from swaggerApi
      mock = await this.filterInvalidJsonUrl(mock);
    }

    // Initialize and normalize parameters
    mock = this.normalizeApiType(mock);

    // Configuration priority: command line parameters > configuration file > default value.
    mock = this.configBasedConfig({ mock, type, port });

    // Merge default config with the read config
    return {
      ...this.defaultConfig,
      ...mock,
    };
  }
}

export default ConfigManager;