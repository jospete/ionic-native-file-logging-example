import { Component } from '@angular/core';
import { Logger } from '@obsidize/rx-console';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private readonly logger = new Logger('Tab2Page');

  constructor() {}

  public printData(data: any): void {
    const totallySuperRandom = Math.round(Math.random() * 1000);
    this.logger.info(`printData()`, data, {totallySuperRandom});
  }
}
