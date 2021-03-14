import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { getLogger, LogEvent, LogEventSource, LogLevel, RxConsole } from '@obsidize/rx-console';
import { CordovaFileEntryApi, RotatingFileStream } from '@obsidize/rotating-file-stream';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File as CordovaFile } from '@ionic-native/file/ngx';
import { buffer, map, concatMap } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';

if (!environment.production) {
  RxConsole.main
    .setLevel(LogLevel.TRACE)
    .events
    .subscribe(ev => ev.broadcastTo(console));
}

@Injectable({
  providedIn: 'root'
})
export class LogManagerService implements OnDestroy {

  private readonly logger: LogEventSource = getLogger('LogManagerService');
  private readonly fileStream: RotatingFileStream<CordovaFileEntryApi>;
  private readonly logFiles: CordovaFileEntryApi[];
  private mFileStreamSub: Subscription;

  constructor(
    private readonly platform: Platform,
    private readonly cdvFile: CordovaFile,
    private readonly socialSharing: SocialSharing
  ) {

    this.mFileStreamSub = new Subscription();

    this.logFiles = CordovaFileEntryApi.createCacheRotationFiles(
      cdvFile,
      'logs',
      ['debug-a.log', 'debug-b.log']
    );

    this.fileStream = new RotatingFileStream({
      maxSize: 2000000, // 2MB
      files: this.logFiles
    });
  }

  public ngOnDestroy(): void {
    this.clearFileStreamSub();
  }

  private clearFileStreamSub(): void {
    // We don't really care if this doesn't work, since the only two ways this will explode are:
    // 1. there is no assigned subscription instance
    // 2. the subscription instance is already unsubscribed
    try { this.mFileStreamSub.unsubscribe(); } catch (e) { }
  }

  public async shareLogsViaEmail(): Promise<void> {

    this.logger.debug('shareLogsViaEmail()');
    const logFilePaths = this.logFiles.map(file => file.toURL());

    await this.socialSharing.shareViaEmail(
      'New App Logs Attached',
      '[' + environment.appId + '] App Logs',
      [],
      [],
      [],
      logFilePaths
    );
  }

  public async initialize(): Promise<void> {

    this.logger.debug('initialize()');

    if (!this.platform.is('cordova')) {
      return;
    }

    this.clearFileStreamSub();
    this.mFileStreamSub = RxConsole.main.events.pipe(

      buffer(interval(5000)),

      map((events: LogEvent[]) => {
        const fileDataString = events.map((ev: LogEvent) => ev.toString()).join('\n');
        return new TextEncoder().encode(fileDataString).buffer;
      }),

      concatMap((fileData: ArrayBuffer) => this.fileStream.write(fileData).catch(e => {
        this.logger.fatal('log file write FATAL: ', e);
      }))

    ).subscribe();
  }
}
