const shell = require('shelljs');
const core = require('@actions/core');

let forAllModules = core.getInput('for-all-modules');
let forEachModule = core.getInput('for-each-module');

// unshallow since GitHub actions does a shallow clone
shell.exec('git fetch --unshallow');
shell.exec('git fetch origin');

const baseBranch = 'origin/' + process.env.GITHUB_BASE_REF;

let changed_modules = [];
shell.exec('git diff --name-only ' + baseBranch, {silent:true}, function (code, stdout, stderr) {
    let changedFiles = stdout.split(/\r?\n/);
    changedFiles.forEach(function(fileName) {
        let moduleName = fileName.split('/')[0];
        if (!changed_modules.includes(moduleName)) {
            changed_modules.push(moduleName);
        }
    });

    let availableTasks = shell.exec('./gradlew tasks --all', {silent:true}).stdout;

    let buildCommands = "";
    changed_modules.forEach(function (module) {
        if (availableTasks.includes(module + ':app:')) {
            if (module != '') {
                buildCommands += " :" + module + ":app:" + forEachModule +
                    " :" + module + ":app:check";
            }
        }
    });

    console.log('Building Pull Request with:', buildCommands);
    shell.exec('./gradlew ' + forAllModules + ' ' + buildCommands);
});
