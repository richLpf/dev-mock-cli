#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { commandOptions } from './config.js';

const yargsCommand = yargs(hideBin(process.argv));

// 检查是否提供了命令
if (process.argv.length < 3) {
  console.error("请提供一个命令，例如: 'dev-mock-cli help'");
  process.exit(1); // 非正常退出
}

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