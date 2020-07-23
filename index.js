const chalk = require("chalk")
const log = console.log
log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'))
log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

log(`
CPU: ${chalk.red('90%')}
RAM: ${chalk.green('40%')}
DISK: ${chalk.yellow('70%')}
`);

log(chalk.keyword('orange')('Yay for orange colored text!'));