import inquirer from 'inquirer';
import logger from './logger.js';

export const ConfirmPort = async (port, newPort) => {

  logger.warn(
      `Port ${port} is occupied, and we will enable port ${newPort}.?`,
  )
  
  return await inquirer
    .prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: `Do you want to continue?`,
        deafult: true,
      },
    ])
    .then((answers) => {
      if (answers.confirm) {
        return true;
      } else {
        return false;
      }
    })
    .catch(() => {
      return true;
    });
}