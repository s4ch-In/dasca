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
  public receipts: any = [];
  public ground: any = [];
  // public page: number = 0;
  public maxSize: number = 10;
  public itemsPerPage: number = 10;
  public bigTotalItems: number = 0;
  public bigCurrentPage: number = 1;
  public numPages: number = 0;
  public lodingPage: boolean = false;
  public textString: string = '';
  public listForm: FormGroup;
  public recForm: FormGroup;
  public groundForm: FormGroup
  public debsForm: FormGroup
  public debgForm: FormGroup
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
    this.recForm = new FormGroup({
      recField: new FormControl(),
    });
    this.groundForm = new FormGroup({
      groundField: new FormControl(),
    });
    this.debsForm = new FormGroup({
      debsFields: new FormControl(),
    });
    this.debgForm = new FormGroup({
      debgFields: new FormControl(),
    });

    this.lodingPage = true;
    this.getPage(this.bigCurrentPage);
    this.getReceipts(this.bigCurrentPageRec);
    this.getGround(this.bigCurrentPageGround);
    this.getDebitors(this.bigCurrentPageDebs)
    this.getDebitorg(this.bigCurrentPageDebg)
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
  bigCurrentPageRec: number = 1
  pageChangedR(page: number) {
    this.bigCurrentPageRec = page
    this.getReceipts(this.bigCurrentPageRec)
  }
  bigCurrentPageGround: number = 1
  pageChangedG(page: number) {
    this.bigCurrentPageGround = page
    this.getGround(this.bigCurrentPageGround)
  }
  bigCurrentPageDebs: number = 1
  pageChangedD(page: number) {
    this.bigCurrentPageDebs = page
    this.getGround(this.bigCurrentPageDebs)
  }
  bigCurrentPageDebg: number = 1
  pageChangedDg(page: number) {
    this.bigCurrentPageDebg = page
    this.getDebitorg(this.bigCurrentPageDebg)
  }
  debitors: any
  bigTotalItemsDebs: number
  debsText: string = ""
  getDebitors(page: number) {
    this.service.api(this.globals.debitors, { c: 'S', key: this.debsText, p: (page - 1) })
      .subscribe(res => {
        if (res.s) {
          // console.log('debitors G', res)
          this.bigTotalItemsDebs = res.d.t;
          this.debitors = res.d.u
        }
      })
  }

  debitorg: any
  bigTotalItemsDebg: number
  debgText: string = ""
  getDebitorg(page: number) {
    this.service.api(this.globals.debitors, { key: this.debgText, p: (page - 1) })
      .subscribe(res => {
        if (res.s) {
          console.log('debitors G', res)
          this.bigTotalItemsDebg = res.d.t;
          this.debitorg = res.d.u
        }
      })
  }

  getPage(page: number) {
    this.service.api(this.globals.list, { key: this.textString, p: (page - 1) })
      .subscribe(res => {
        this.lodingPage = false;
        if (res.s) {
          console.log('Sport', res)

          this.bigTotalItems = res.d.t;
          this.list = res.d.u;
        } else {
          console.log('Error');
        }
      });
  }
  bigTotalItemsRec: number
  recText: string = '';
  getReceipts(page: number) {
    this.service.api(this.globals.receipt, { key: this.recText, p: (page - 1) }).subscribe(res => {
      if (res.s) {

        this.bigTotalItemsRec = res.t;
        this.receipts = res.d;
      }
    })
  }
  bigTotalItemsGround: number
  groundText: string = ''

  getGround(page: number) {
    this.service.api(this.globals.groundList, { key: this.groundText, p: (page - 1) }).subscribe(res => {
      if (res.s) {
        console.log('Groundd', res.d)
        this.bigTotalItemsGround = res.t;
        this.ground = res.d;

      }
    })
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

  grdata: any = {}
  ngOnInit() {
    if (localStorage.getItem('groundData')) {
      // console.log(localStorage.getItem('groundData'))
      // localStorage.setItem('groundData', this.grdata)
      localStorage.removeItem('groundData')
    }
    if (localStorage.getItem('detail')) {
      // console.log(localStorage.getItem('groundData'))
      // localStorage.setItem('groundData', this.grdata)
      localStorage.removeItem('detail')
    }
    if (localStorage.getItem('recData')) {
      // console.log(localStorage.getItem('groundData'))
      // localStorage.setItem('groundData', this.grdata)
      localStorage.removeItem('recData')
    }
    if (localStorage.getItem('formState')) {
      // console.log(localStorage.getItem('groundData'))
      // localStorage.setItem('groundData', this.grdata)
      localStorage.removeItem('formState')
    }
    if (localStorage.getItem('formData')) {
      localStorage.removeItem('formState')
    }


    let searchField = this.listForm.get('searchField') as FormControl;
    let recField = this.recForm.get('recField') as FormControl;
    let groundField = this.groundForm.get('groundField') as FormControl;
    let debsFields = this.debsForm.get('debsFields') as FormControl
    let debgFields = this.debgForm.get('debgFields') as FormControl

    searchField.valueChanges
      .do((ele) => {
        this.list = [];
      }).subscribe((query) => {
        this.textString = query;
        this.lodingPage = true;
        this.bigCurrentPage = 1;
        this.getPage(this.bigCurrentPage);
      })

    recField.valueChanges
      .do((ele) => {
        this.receipts = [];
      }).subscribe((query) => {
        this.recText = query
        this.bigCurrentPageRec = 1
        this.getReceipts(this.bigCurrentPageRec)
      })

    groundField.valueChanges
      .do((ele) => {
        this.ground = [];
      }).subscribe((query) => {
        this.groundText = query
        this.bigCurrentPageGround = 1
        this.getGround(this.bigCurrentPageGround)
      })

    debsFields.valueChanges
      .do((ele) => {
        this.debitors = [];
      }).subscribe((query) => {
        this.debsText = query
        this.bigCurrentPageDebs = 1
        this.getDebitors(this.bigCurrentPageDebs)
      })
    debgFields.valueChanges
      .do((ele) => {
        this.debitorg = [];
      }).subscribe((query) => {
        this.debgText = query
        this.bigCurrentPageDebg = 1
        this.getDebitors(this.bigCurrentPageDebg)
      })

  }

  getData(i: number) {
    // console.log('view', this.list[i].doc);
    let data = JSON.stringify(this.list[i].doc)
    localStorage.setItem('detail', data)
    localStorage.setItem('formState', 'sports')

    this.router.navigate(['details'])
  }
  getRecData(i: number) {
    let data = JSON.stringify(this.receipts[i])
    localStorage.setItem('recData', data)
    localStorage.setItem('formState', 'receipt')
    this.router.navigate(['details'])
    // this.router.navigate(['print'])
  }
  getGroundData(i: number) {
    let data = JSON.stringify(this.ground[i])
    localStorage.setItem('groundData', data)
    localStorage.setItem('formState', 'ground')
    this.router.navigate(['details'])
  }

}
