#!/usr/bin/env node

/* eslint-disable node/shebang */
const yargs = require('yargs');

const config = require('./config');

const update = require('./lib/update');

yargs.usage(`
$0 <cmd> [args]
`);

config.forEach(commandConfig => {
    const { command, description, options, callback } = commandConfig;
    yargs.command(
        command,
        description,
        yargs => yargs.options(options),
        (argv = {}, ...args) => {
            const { skipAutoUpdate } = argv;
            if (!skipAutoUpdate && update()) {
                // eslint-disable-next-line no-process-exit
                process.exit(0);
            }

            callback(argv, ...args);
        }
    );
});

yargs.demandCommand().strict().argv;