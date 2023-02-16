import { Component, ViewContainerRef } from '@angular/core';
import { Logger } from '@obsidize/rx-console';
import { tap } from 'rxjs/operators';
import { ionViewWillEnter } from 'src/globals/ion-page-events';
import { LogManagerService } from '../services/log-manager.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private readonly logger = new Logger('Tab1Page');

  public readonly pageWillEnter$ = ionViewWillEnter(this.containerRef).pipe(
    tap(ev => this.logger.debug('page enter', ev))
  );

  constructor(
    private readonly containerRef: ViewContainerRef,
    private readonly logManager: LogManagerService
  ) {
  }

  public async sendAppLogs(): Promise<void> {
    this.logger.debug('sendAppLogs()');
    await this.logManager.shareLogsViaEmail();
  }
}
