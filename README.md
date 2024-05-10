# Ionic/Capacitor File-based Logging Example

This is a simple shell app that utilizes 
[@obsidize/rx-console](https://github.com/jospete/obsidize-rx-console)
and [cordova-plugin-secure-logger](https://github.com/jospete/cordova-plugin-secure-logger)
to stream log events to a native rotating file stream.

See the [LogManagerService](https://github.com/jospete/ionic-native-file-logging-example/blob/master/src/app/services/log-manager.service.ts)
implementation for relevant details.

**NOTE**: This project uses the social sharing plugin for example purposes to be able to extract
the log data locally. **This is for demonstration purposes only.** Logs should be uploaded
to a secure server in most production use cases to avoid bleeding out sensitive user data.

# Building This Project

### Prerequisites

1. [Git](https://git-scm.com/downloads) must be installed and available on command line

2. NVM must be installed and available on command line

- [nvm for mac](https://github.com/coreybutler/nvm-windows)
- [nvm for windows](https://github.com/coreybutler/nvm-windows)

### Build Steps

```bash
# clone this repo
git clone https://github.com/jospete/ionic-native-file-logging-example.git

# cd into the fresh clone folder
cd ionic-native-file-logging-example

# make sure you're using the correct node version via nvm
nvm use

# if nvm gives a "version not found" error
# nvm install 18
# nvm use

# install project dependencies
npm install

# initialize project artificats
npm run app:init

# open android project to run it
npx cap open android

# or open ios project
# npx cap open ios
```