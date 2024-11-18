// import { Confirm } from 'enquirer';
import logger from './logger.js';

export const ConfirmPort = async (port, newPort) => {
  logger.warn(
    `Port ${port} is occupied, and we will enable port ${newPort}.`
  );
  
  return true
  // 当前确认包支持的node版本>18，暂时屏蔽
  // current enquirer package must support node > 18, so temporarily blocked 
  // try {
  //   const prompt = new Confirm({
  //     name: 'confirm',
  //     message: 'Do you want to continue?',
  //     initial: true, // 默认值，等价于 Inquirer 的 `default`
  //   });

  //   const answer = await prompt.run();
  //   return answer; // `true` 表示用户选择 Yes，`false` 表示用户选择 No
  // } catch (error) {
  //   // 如果发生异常，例如用户中断交互，默认返回 true
  //   return true;
  // }
};