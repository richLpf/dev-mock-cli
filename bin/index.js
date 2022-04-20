#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const config = require('./config')

const yargsCommand = yargs(hideBin(process.argv))

config.forEach(commandConfig => {
  const { command, descriptions, options, callback } = commandConfig
  yargsCommand.command(
    command,
    descriptions,
    yargs => yargs.options(options),
    (argv, ...rest) => {
      callback(argv, ...rest);
    }
  )
})
  
yargsCommand.help().argv