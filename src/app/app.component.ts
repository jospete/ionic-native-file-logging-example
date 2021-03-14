import { Component } from '@angular/core';
import { getLogger, LogEventSource } from '@obsidize/rx-console';
import { AppBootstrapService } from './services/app-bootstrap.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private readonly logger: LogEventSource = getLogger('AppComponent');

  constructor(
    private readonly appBootstrap: AppBootstrapService
  ) {
    this.appBootstrap.initialize()
      .catch(e => this.logger.fatal('appBootstrap.initialize() FATAL: ', e));
  }
}
