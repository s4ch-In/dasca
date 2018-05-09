import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
// var printer = require('printer');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private elt : ElectronService
  ){
    // console.log(printer);
    
    // this.elt.
  }
}
