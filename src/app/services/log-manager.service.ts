import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Logger, LogLevel, getPrimaryLoggerTransport } from '@obsidize/rx-console';
import { sendRxConsoleEventToNative } from 'cordova-plugin-secure-logger/www/rx-console';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { environment } from 'src/environments/environment';
import { SecureLogger } from 'cordova-plugin-secure-logger';

const primaryTransport = getPrimaryLoggerTransport();
const targetLogLevel = environment.production ? LogLevel.DEBUG : LogLevel.VERBOSE;
const tempLogFileName = `app.log`;

primaryTransport
  .setFilter(ev => ev.level >= targetLogLevel)
  .setDefaultBroadcastEnabled(!environment.production)
  .events()
  .addListener(sendRxConsoleEventToNative);

@Injectable({
  providedIn: 'root'
})
export class LogManagerService {

  private readonly logger = new Logger('LogManagerService');

  constructor(
    private readonly platform: Platform,
    private readonly socialSharing: SocialSharing,
  ) {
  }

  private get isNativePlatform(): boolean {
    return this.platform.is('cordova')
      || this.platform.is('capacitor');
  }

  public async initialize(): Promise<void> {

    this.logger.debug('initialize()');

    if (!this.isNativePlatform) {
      this.logger.info(`removing native proxy (non-native-platform)`);
      primaryTransport.events().removeListener(sendRxConsoleEventToNative);
      SecureLogger.clearEventCacheFlushInterval();
    }
  }

  // Example for sharing log files via the share plugin
  public async shareLogsViaEmail(): Promise<void> {

    this.logger.debug('shareLogsViaEmail()');
    const filePath = await this.saveTempLogFile();
    const filesPaths = [filePath];
    this.logger.debug('opening email with file attachments: ', filesPaths);

    await this.socialSharing.share(
      'New App Logs Attached',
      '[' + environment.appId + '] App Logs',
      filesPaths
    );

    await this.deleteTempLogFile();
  }

  private async deleteTempLogFile(): Promise<void> {
    await Filesystem.deleteFile({
      directory: Directory.Cache,
      path: tempLogFileName,
    });
  }

  private async saveTempLogFile(): Promise<string> {

    const dataBytes = await SecureLogger.getCacheBlob();
    const dataBlob = new Blob([dataBytes]);

    await Filesystem.writeFile({
      directory: Directory.Cache,
      path: tempLogFileName,
      data: dataBlob,
      encoding: Encoding.UTF8,
    });

    const { uri } = await Filesystem.getUri({
      directory: Directory.Cache,
      path: tempLogFileName,
    });

    return uri;
  }
}
