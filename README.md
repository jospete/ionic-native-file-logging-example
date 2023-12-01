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

```bash
git clone https://github.com/jospete/ionic-native-file-logging-example.git
cd ionic-native-file-logging-example
nvm use
npm install
npm run init
npx cap open android
# OR: npx cap open ios
```