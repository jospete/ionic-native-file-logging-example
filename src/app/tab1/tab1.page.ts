import { Component } from '@angular/core';
import { getLogger, LogEventSource } from '@obsidize/rx-console';
import { LogManagerService } from '../services/log-manager.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private readonly logger: LogEventSource = getLogger('Tab1Page');

  constructor(
    private readonly logManager: LogManagerService
  ) {
  }

  public async sendAppLogs(): Promise<void> {
    this.logger.debug('sendAppLogs()');
    await this.logManager.shareLogsViaEmail();
  }
}
