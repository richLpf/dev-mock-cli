import chalk from 'chalk';

const colorMapper = {
  log: msg => msg + '',
  tip: msg => chalk.blue.italic(msg),
  success: msg => chalk.green(msg),
  warn: msg => chalk.yellowBright(msg),
  error: msg => chalk.red.bold(msg)
};

const logger = {
  label: label => console.log(chalk.black.bgCyan(`[${label}]`))
};

for (const key in colorMapper) {
  if (colorMapper.hasOwnProperty(key)) {
    const mapper = colorMapper[key];
    logger[key] = msg => console.log(mapper(msg));
    logger[`${key}L`] = (label, msg) => console.log(`${chalk.black.bgCyan(`[${label}]`)} ${mapper(msg)}`);
  }
}

export default logger;
