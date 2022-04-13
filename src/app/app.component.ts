import { Component } from '@angular/core';
import { Logger } from '@obsidize/rx-console';
import { AppBootstrapService } from './services/app-bootstrap.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private readonly logger = new Logger('AppComponent');

  constructor(
    private readonly appBootstrap: AppBootstrapService
  ) {
    this.appBootstrap.initialize()
      .catch(e => this.logger.fatal('appBootstrap.initialize() FATAL: ', e));
  }
}
