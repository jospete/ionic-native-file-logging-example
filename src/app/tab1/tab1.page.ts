import { Component } from '@angular/core';
import { Logger } from '@obsidize/rx-console';
import { LogManagerService } from '../services/log-manager.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private readonly logger = new Logger('Tab1Page');

  constructor(
    private readonly logManager: LogManagerService
  ) {
  }

  public async sendAppLogs(): Promise<void> {
    this.logger.debug('sendAppLogs()');
    await this.logManager.shareLogsViaEmail();
  }
}
