import { Component, OnInit } from '@angular/core';
// import { amountToString } from './print.helper';
import { Globals } from './../../globals'
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  constructor(
    public globals: Globals,
    public service: MasterService
  ) {
    // console.log(amountToString(5346))
  }

  ngOnInit() {
    this.service.api(this.globals.receipt).subscribe(res => {
      console.log(res)
    })
  }

}
