#!/usr/bin/env node

const chalk = require("chalk");
const program = require("commander");
const version = require("../package.json").version;
const didYouMean = require("didyoumean");

const dev = require('../lib/command/dev')
const mock = require('../lib/command/mock')

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        "You are using Node " +
          process.version +
          ", but this version of " +
          id +
          " requires Node " +
          wanted +
          ".\nPlease upgrade your Node version."
      )
    );
    process.exit(1);
  }
}

program.version(version).usage("<comman>[options]");

program
  .command("create <app-name>")
  .description("Create a project with template already created.")
  .action((name, cmd) => {
    console.log("cmd", name, cmd);
    require("../lib/command/create")(name);
  });

program.command("dev")
  .description("dev project")
  .option('-P, --port <port>', 'which port to run', 3000)
  .option('-wb, withoutBrowser [boolean]', 'without open browser', false)
  .action((argv) => {
    console.log('Start to run dev of project', argv);
    dev({
      ...argv,
      env: 'pre'
    })
  })

program.command("mock")
  .description("mock action api")
  .option('-t, --type <string>', "select api type", "action")
  .option('-P, --port <port>', 'which port to run', 9000)
  .action((argv) => {
    console.log('mock', argv);
    mock({
      ...argv
    })
  })

program
  .command("project list")
  .description("Get template project list")
  .action((name, cmd) => {
    console.log("name", name);
    console.log("cmd", cmd);
  });

// output help information on unknown commands
program.arguments("<command>").action((cmd) => {
  program.outputHelp();
  console.log("  " + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(cmd);
});

// cli command
program.on("--help", () => {
  console.log(
    `  Run ${chalk.cyan(
      "app-cli <command> --help"
    )} for detailed usage of given command.`
  );
});

program.parse(process.argv);
//console.log("process", process.argv)
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

function suggestCommands(cmd) {
  console.log("cmd", cmd);
  const availableCommands = program.commands.map((cmd) => {
    return cmd._name;
  });

  const suggestion = didYouMean(cmd, availableCommands);
  console.log("suggestion", suggestion);
  if (suggestion) {
    console.log("  " + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}
