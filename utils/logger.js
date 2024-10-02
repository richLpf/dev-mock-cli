import chalk from 'chalk';

// 定义颜色映射器
const colorMapper = {
  log: msg => msg + '',
  tip: msg => chalk.blue.italic(msg),
  success: msg => chalk.green(msg),
  warn: msg => chalk.yellowBright(msg),
  error: msg => chalk.red.bold(msg),
};

// 通用标签打印函数
const labelMessage = (label, msg) => `${chalk.black.bgCyan(`[${label}]`)} ${msg}`;

// 定义 logger
const logger = {
  label: label => console.log(chalk.black.bgCyan(`[${label}]`))
};

// 遍历 colorMapper 创建日志函数
Object.keys(colorMapper).forEach(key => {
  const mapper = colorMapper[key];
  
  logger[key] = msg => console.log(mapper(msg));
  logger[`${key}L`] = (label, msg) => console.log(labelMessage(label, mapper(msg)));
});

export default logger;