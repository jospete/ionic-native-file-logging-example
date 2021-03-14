import { Component } from '@angular/core';
import { getLogger, LogEventSource } from '@obsidize/rx-console';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  private readonly logger: LogEventSource = getLogger('TabsPage');

  constructor() {
  }

  public onTabChange(tabIndex: number): void {
    this.logger.info('onTabChange(): ' + tabIndex);
  }
}
