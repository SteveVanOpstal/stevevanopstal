import {Component} from '@angular/core';

import {IconService} from './services/icon.service';

@Component({selector: 'svo-root', templateUrl: './app.component.html'})
export class AppComponent {
  constructor(public icons: IconService) {}
}
