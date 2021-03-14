import { Injectable } from '@angular/core';
import { getLogger, LogEventSource, LogLevel, RxConsole } from '@obsidize/rx-console';
import { File as CordovaFile } from '@ionic-native/file/ngx';
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
export class LogManagerService {

  private readonly logger: LogEventSource = getLogger('LogManagerService');

  constructor(
    private readonly cdvFile: CordovaFile
  ) {
  }

  public async initialize(): Promise<void> {
    this.logger.debug('initialize()');
    // TODO: hook up logger to cordova file plugin
  }
}
