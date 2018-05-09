import { FormGroup, FormControl } from '@angular/forms';
import { Globals } from './../../globals';
import { MasterService } from './../../services/master.service';
import { Component, OnInit } from '@angular/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { stringify } from 'querystring';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public list: any = [];
  // public page: number = 0;
  public maxSize: number = 6;
  public itemsPerPage: number = 1;
  public bigTotalItems: number = 0;
  public bigCurrentPage: number = 1;
  public numPages: number = 0;
  public lodingPage: boolean = false;
  public textString: string = '';
  public listForm: FormGroup;
  constructor(
    private service: MasterService,
    private globals: Globals,
    private notif: NotificationsService,
    public router: Router
  ) {
    // this.service.api(this.globals.register, this.registerForm.value).subscribe(res => {
    // this.service.api(this.globals.list,{key:''})
    // .subscribe((res)=>{
    //   console.log('res',res);
    //   if(res.s){
    //     this.list=res.d.u;
    //   }
    // })
    this.listForm = new FormGroup({
      searchField: new FormControl(),
    });
    this.lodingPage = true;
    this.getPage(this.bigCurrentPage);
  }
  // loadmore(){
  //   this.lodingPage = true;
  //   this.getPage(++this.page);
  // }
  pageChanged(page: number) {
    // console.log('page : ',page)
    this.lodingPage = true;
    this.bigCurrentPage = page;
    this.getPage(this.bigCurrentPage);
  }

  getPage(page: number) {
    this.service.api(this.globals.list, { key: this.textString, p: (page - 1) })
      .subscribe(res => {
        this.lodingPage = false;
        if (res.s) {
          this.bigTotalItems = res.d.t;
          this.list = res.d.u;
        } else {
          console.log('Error');
        }
      });
  }
  showErr(msg) {
    let toastopt = {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 50
    };
    this.notif.success(
      'Done',
      msg,
      toastopt
    );
  }

  ngOnInit() {
    let searchField = this.listForm.get('searchField') as FormControl;

    searchField.valueChanges
      .do((ele) => {
        this.list = [];
      }).subscribe((query) => {
        this.textString = query;
        this.lodingPage = true;
        this.bigCurrentPage = 1;
        this.getPage(this.bigCurrentPage);
      })
  }

  getData(i: number) {
    // console.log('view', this.list[i].doc);
    let data = JSON.stringify(this.list[i].doc)
    localStorage.setItem('detail', data)
    this.router.navigate(['details'])
  }

}
