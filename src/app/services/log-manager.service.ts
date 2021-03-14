import { Injectable } from '@angular/core';
import { getLogger, LogEventSource } from '@obsidize/rx-console';
import { File as CordovaFile } from '@ionic-native/file/ngx';

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
