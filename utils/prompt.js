import inquirer from 'inquirer';
import logger from './logger.js';

export const ConfirmPort = async (port, newPort) => {
  return await inquirer
    .prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: logger.warn(
          `Port ${port} is occupied, and we will enable port ${newPort}.?`,
        ),
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