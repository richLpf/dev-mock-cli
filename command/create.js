const path = require("path");
const fs = require("fs-extra");

const inquirer = require("inquirer");
const Ora = require("ora");
const chalk = require("chalk");
const logSymbols = require("log-symbols");
const validateProjectName = require("validate-npm-package-name");
const TPL_TYPE = require("../utils/enum");
const downloadFromRemote = require("../utils/downloadFromRemote");

module.exports = async function create(projectName) {
  const cwd = process.cwd();
  console.log("cwd", cwd);
  const targetDir = path.resolve(cwd, projectName);
  //console.log("targetDir", targetDir)
  const name = path.relative(cwd, projectName);
  //console.log("name", name)

  const result = validateProjectName(name);
  //console.log("result", result)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    result.errors &&
      result.errors.forEach((err) => {
        console.error(chalk.red.dim("Error: " + err));
      });
    result.warnings &&
      result.warnings.forEach((warn) => {
        console.error(chalk.red.dim("Warning: " + warn));
      });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: `Target directory ${chalk.cyan(
          targetDir
        )} already exists. Pick an action:`,
        choices: [
          { name: "Overwrite", value: "overwrite" },
          { name: "Cancel", value: false },
        ],
      },
    ]);
    //console.log("action", action)
    if (!action) {
      return;
    } else if (action === "overwrite") {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    }
  }

  const { templateType, author, description, version } = await inquirer.prompt([
    {
      name: "templateType",
      type: "list",
      default: "vue",
      choices: [
        {
          name: "React",
          value: "react",
        },
      ],
      message: "Select the template type.",
    },
    {
      type: "input",
      name: "description",
      message: "Please input your project description.",
      default: "description",
      validate(val) {
        return true;
      },
      transformer(val) {
        return val;
      },
    },
    {
      type: "input",
      name: "author",
      message: "Please input your author name.",
      default: "author",
      validate(val) {
        return true;
      },
      transformer(val) {
        return val;
      },
    },
    {
      type: "input",
      name: "version",
      message: "Please input your version.",
      default: "0.0.1",
      validate(val) {
        return true;
      },
      transformer(val) {
        return val;
      },
    },
  ]);

  // console.log("templateType", templateType, author, description, version)

  const remoteUrl = TPL_TYPE[templateType];
  console.log(
    logSymbols.success,
    `Creating template of project ${templateType} in ${targetDir}`
  );
  const spinner = new Ora({
    text: `Download template from ${remoteUrl}\n`,
  });

  spinner.start();

  //console.log("remoteUrl", remoteUrl)
  //console.log("projectName", projectName)

  downloadFromRemote(remoteUrl, projectName)
    .then((res) => {
      fs.readFile(
        `./${projectName}/package.json`,
        "utf8",
        function (err, data) {
          if (err) {
            spinner.stop();
            console.error(err);
            return;
          }
          const packageJson = JSON.parse(data);
          packageJson.name = projectName;
          packageJson.description = description;
          packageJson.author = author;
          packageJson.version = version;
          var updatePackageJson = JSON.stringify(packageJson, null, 2);
          fs.writeFile(
            `./${projectName}/package.json`,
            updatePackageJson,
            "utf8",
            function (err) {
              if (err) {
                console.error(err);
              } else {
                console.log(
                  logSymbols.success,
                  chalk.green(
                    `Successfully created project template of ${templateType}\n`
                  )
                );
                console.log(
                  `${chalk.grey(`cd ${projectName}`)}\n${chalk.grey(
                    "yarn install"
                  )}\n${chalk.grey("yarn serve")}\n`
                );
              }
              spinner.stop();
              process.exit(0);
            }
          );
        }
      );
    })
    .catch((err) => {
      console.log(logSymbols.error, err);
      spinner.fail(
        chalk.red("Sorry, it must be something error, please check it out. \n")
      );
      process.exit(1);
    });
};
