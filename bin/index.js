import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { commandOptions } from './config.js';

const yargsCommand = yargs(hideBin(process.argv));

commandOptions.forEach(commandConfig => {
  const { command, descriptions, options, callback } = commandConfig;
  yargsCommand.command(
    command,
    descriptions,
    yargs => yargs.options(options),
    (argv, ...rest) => {
      callback(argv, ...rest);
    }
  );
});

yargsCommand.help().argv;