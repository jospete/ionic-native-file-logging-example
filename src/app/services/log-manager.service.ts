import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LogEvent, Logger, LogLevel, RxConsole } from '@obsidize/rx-console';
import { CordovaFileEntryApi, RotatingFileStream } from '@obsidize/rotating-file-stream';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File as CordovaFile } from '@ionic-native/file/ngx';
import { buffer, concatMap } from 'rxjs/operators';
import { fromEventPattern, interval, Observable, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';

if (!environment.production) {
  RxConsole.main
    .setLevel(LogLevel.TRACE)
    .enableDefaultBroadcast();
}

@Injectable({
  providedIn: 'root'
})
export class LogManagerService implements OnDestroy {

  private readonly logger = new Logger('LogManagerService');
  private readonly fileStream: RotatingFileStream<CordovaFileEntryApi>;

  private mFileStreamSub: Subscription;

  constructor(
    private readonly platform: Platform,
    private readonly socialSharing: SocialSharing,
    cdvFile: CordovaFile,
  ) {

    this.mFileStreamSub = new Subscription();
    this.fileStream = new RotatingFileStream({
      maxFileSize: 2e6, // 2MB
      files: CordovaFileEntryApi.createCacheRotationFiles(
        cdvFile,
        'logs',
        ['debug-a.log', 'debug-b.log']
      )
    });
  }

  public ngOnDestroy(): void {
    this.clearFileStreamSub();
  }

  private clearFileStreamSub(): void {
    // We don't really care if this doesn't work, since the only two ways this will explode are:
    // 1. there is no assigned subscription instance
    // 2. the subscription instance is already unsubscribed
    try { this.mFileStreamSub.unsubscribe(); } catch { }
  }

  public async shareLogsViaEmail(): Promise<void> {

    this.logger.debug('shareLogsViaEmail()');
    const files = await this.fileStream.refreshAllEntries();
    const logFilePaths = files.map(file => file.toURL());
    this.logger.debug('opening email with file attachments: ', logFilePaths);

    await this.socialSharing.share(
      'New App Logs Attached',
      '[' + environment.appId + '] App Logs',
      logFilePaths
    );
  }

  public async initialize(): Promise<void> {

    this.logger.debug('initialize()');

    if (!this.platform.is('cordova')) {
      return;
    }

    this.clearFileStreamSub();
    
    this.mFileStreamSub = RxConsole
      .main
      .asObservable<Observable<LogEvent>>(fromEventPattern)
      .pipe(

        // Accumulate log events for 5 seconds
        buffer(interval(5000)),

        // NOTE: typically we would do event handling in the subscribe block,
        // but we can only write to files one-at-a-time, so we put the actual subscribe logic in concatMap() instead.
        concatMap(events => this.saveLogEvents(events).catch(e => {
          this.logger.fatal('log file write FATAL: ', e);
        }))

        // Activate this subscription to start recieving events.
      ).subscribe();
  }

  private async saveLogEvents(events: LogEvent[]): Promise<void> {

    // Don't do anything if there are no new events
    if (!events || events.length <= 0) {
      return;
    }

    // Combine the buffered events to a string payload
    // (need to tack on a newline at the end since join doesn't do that)
    const outputText = `${events.map((ev: LogEvent) => ev.toString()).join('\n')}\n`;

    // Encode the string as an ArrayBuffer
    const outputBuffer = new TextEncoder().encode(outputText).buffer;

    // Write the encoded content to the RotatingFileStream instance.
    // NOTE: the stream will handle file swapping in the background, so we don't have to handle that part directly.
    await this.fileStream.write(outputBuffer);
  }
}
