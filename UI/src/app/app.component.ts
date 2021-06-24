import { Component } from '@angular/core';
import * as rxjs from 'rxjs';
import * as lodash from 'lodash';

declare global {
  interface Window {
    rxjs: any;
    _: any;
  }
}

window.rxjs = rxjs;
window._ = lodash;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'simple-app';
}
