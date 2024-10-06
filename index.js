import MockServer from './server.js';
import ConfigManager from './utils/config.js';

const mock = async (commandArgs) => {
  const GlobalConfig = new ConfigManager();
  const config = await GlobalConfig.getConfig(commandArgs);
  const mockServer = new MockServer(config);
  mockServer.start();
}

export default mock;