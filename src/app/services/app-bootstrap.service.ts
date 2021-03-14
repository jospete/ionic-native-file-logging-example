import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { getLogger, LogEventSource } from '@obsidize/rx-console';
import { environment } from 'src/environments/environment';
import { LogManagerService } from './log-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AppBootstrapService {

  public static readonly ERR_INIT_ALREADY_STARTED: string = 'AppBootstrapService_ERR_INIT_ALREADY_STARTED';

  private readonly logger: LogEventSource = getLogger('AppBootstrapService');
  private mDidStartInitialize: boolean = false;

  constructor(
    private readonly platform: Platform,
    private readonly logManager: LogManagerService
  ) {
  }

  public get didStartInitialize(): boolean {
    return this.mDidStartInitialize;
  }

  public async initialize(): Promise<void> {

    this.logger.debug('initialize()');

    if (this.didStartInitialize) {
      return Promise.reject(AppBootstrapService.ERR_INIT_ALREADY_STARTED);
    }

    this.mDidStartInitialize = true;
    await this.runInitializeActions();
  }

  private async runInitializeActions(): Promise<void> {

    this.logger.debug('runInitializeActions()');

    await this.platform.ready();
    await this.logManager.initialize();

    this.logger.debug('****************************** APP START ******************************');
    this.logger.debug('  environment setup: ' + JSON.stringify(environment, null, '\t'));
    // TODO: put other useful startup information here
    this.logger.debug('***********************************************************************');
  }
}
