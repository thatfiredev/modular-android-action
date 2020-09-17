# Github Actions for Modular Android Projects

As most Android Developers know, an [Android Project](https://developer.android.com/studio/projects) may have many
 different modules.
 
If you change one single module and submit a Pull Request, most CI workflows will try to build/test all the
 existing modules, which might take a lot of time, when in reality you only need to build the module you changed.
 
This GitHub Action aims to solve that problem. When you submit a Pull Request, it will only build the module you changed,
 or no module at all if you left them untouched (in case of documentation or configuration changes).
 
## Usage

Add it to your workflow YAML like this:
```yaml
    - name: Build with Modular Action
      uses: rosariopfernandes/modular-android-action@v0.2.0
      with:
        for-each-module: 'assembleDebug'
        for-all-modules: 'check'
```

As you can see, it takes 2 arguments:

1. `for-each-module` - gradle task to run for each module.
1. `for-all-modules` - gradle task to run for all modules.

In the example above, the final call to gradle would look like this:
```shell
./gradlew check changedModule1:assembleDebug changedModule2:assembleDebug
```

## Example Workflow
```yaml
# .github/workflows/pull_requests.yml

name: Modular Android Build (PR)

on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: set up JDK 1.8
      uses: actions/setup-java@v1
      with:
        java-version: 1.8
    - name: Build Pull Request
      uses: rosariopfernandes/modular-android-action@v0.2.0
      with:
        for-each-module: 'test'
        for-all-modules: 'check clean'
```

## Limitation

Please note that this code only works if all modules are independent. So if you have `moduleA` dependending on `moduleB` 
 and you make changes to `moduleB`, then `moduleA` might break and not be tested.

## License

This project is licensed under the MIT License. See the [LICENSE file](LICENSE) for more details.
