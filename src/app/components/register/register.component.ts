import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { Globals } from './../../globals';
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { DatePipe } from '@angular/common';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { PrintService } from '../../services/print.service';

// var path = require('path');
// const fs = require('fs');
// var os = require('os');
// var url = require('url');
// console.log('file System : ',fs)
// console.log('System OS : ',os)
// var electronPrinter = require("electron-printer");
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  sportsForm: boolean = true
  groundForm: boolean = false
  personal: boolean = true
  company: boolean = false
  registerForm: FormGroup;
  groundregForm: FormGroup;
  submited: boolean = false;

  totalAmount: FormControl
  dateFromTo: FormControl
  isDocument: boolean = false;
  date: Date = new Date
  dy: number = this.date.getFullYear()
  currentMonth = this.date.getMonth() + 1
  fyq1: any = this.dy + '-' + (this.dy + 1)
  fyq2: any = this.dy + '-' + (this.dy + 1)
  fyq3: any = this.dy + '-' + (this.dy + 1)
  fyq4: any = (this.dy + 1) + '-' + (this.dy + 2)
  get quarters(): FormArray { return this.registerForm.get('membership').get('quarters') as FormArray; }

  @ViewChild('formDom') formDom: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private service: MasterService,
    private datePipe: DatePipe,
    private globals: Globals,
    private elt: ElectronService,
    private routes: Router,
    private printService: PrintService,
    // private toast :ToastsManager,
    // vcr: ViewContainerRef
    private notif: NotificationsService,
  ) {
    // this.toast.setRootViewContainerRef(vcr);
    let formD = {
      receiptId: '123455',
      userId: '123455',
      name: 'KUndan Prasad',
      mobileNo: '123455',
      dob: '123455',
      caste: '123455',
      school: '123455',
      paidFor: '123455',
      membership: {
        q1: 'q1',
        q2: 'q1',
        q3: 'q1',
        q4: 'q1',
      },
      totalAmount: '123455',
      discountAmount: '123455',
      discountPercent: '123455',
      finalAmount: '123455',
      amountPaid: '123455',
      balance: '123455'
    }
    this.printService.print(formD)
    // console.log('printer : ', printer);
    //let todayDate = this.datePipe.transform(new Date(), 'shortTime');
    // this.totalAmount = new FormControl('', Validators.required)
    // this.amountPaid = new FormControl('', Validators.required)

    this.registerForm = this.formBuilder.group({
      batch: new FormControl('MORNING'),
      time: new FormControl(),
      membership: new FormGroup({
        q1: new FormGroup({
          status: new FormControl(false),
          FY: new FormControl(this.fyq1),
        }),
        q2: new FormGroup({
          status: new FormControl(false),
          FY: new FormControl(this.fyq2),
        }),
        q3: new FormGroup({
          status: new FormControl(false),
          FY: new FormControl(this.fyq3),
        }),
        q4: new FormGroup({
          status: new FormControl(false),
          FY: new FormControl(this.fyq4),
        }),
      }),

      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(),
      lastName: new FormControl('', Validators.required),
      father: new FormGroup({
        ffullName: new FormControl('', Validators.required),
        foccupation: new FormControl(),
        fanualIncome: new FormControl(),
        fmobileNo: new FormControl('', Validators.required),
        fresNo: new FormControl(),
      }),
      mother: new FormGroup({
        mfullName: new FormControl('', Validators.required),
        moccupation: new FormControl(),
        mmobileNo: new FormControl()
      }),
      dob: new FormControl('', Validators.required),
      currentClass: new FormControl('', Validators.required),
      school: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      mobileNo: new FormControl('', Validators.required),
      heightInCms: new FormControl(),
      weightInKg: new FormControl(),
      coachingCampDetail: new FormControl(),
      repSchoolTeam: new FormControl(),
      prevParticipation: new FormControl(),
      otehrAreaOfInterest: new FormControl(),
      addIncharge: new FormControl('', Validators.required),
      feesPaid: new FormControl('', Validators.required),
      coach: new FormControl(),
      secretary: new FormControl(),
      totalAmount: new FormControl(0, Validators.required),
      amountPaid: new FormControl(0, Validators.required),
      balance: new FormControl(0, Validators.required),
      narration: new FormControl('', Validators.required),
      mode: new FormControl('CASH', Validators.required),
      sport: new FormControl('Cricket', Validators.required),
      document: new FormGroup({
        no: new FormControl(),
        bank: new FormControl(),
        date: new FormControl()
      }),
      discountPercent: new FormControl(),
      discountAmount: new FormControl(),
      finalAmount: new FormControl(),
      caste: new FormControl(),
    });


  }


  ngAfterViewInit() {
    this.formDom.nativeElement.querySelector(".form-control[name='firstName']").focus();
    // console.log('route : ', );
  }

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
      // console.log('remove', localStorage.getItem('formData'))
      localStorage.removeItem('formData')
    }

    this.groundregForm = this.formBuilder.group({
      dateFromTo: this.dateFromTo,
      regNo: new FormControl,
      narration: new FormControl(),
      balance: new FormControl(),
      totalAmount: new FormControl(0, Validators.required),
      amountPaid: new FormControl(0, Validators.required),
      person: new FormGroup({
        name: new FormControl('', Validators.required),
        contactNo: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
      }),
      company: new FormGroup({
        name: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        contactNo: new FormControl('', Validators.required)
      }),
      poc: new FormGroup({
        name: new FormControl('', Validators.required),
        contactNo: new FormControl()
      }),
      category: new FormControl('P', Validators.required),
      mode: new FormControl('CASH', Validators.required),
      document: new FormGroup({
        no: new FormControl(),
        bank: new FormControl(),
        date: new FormControl()
      }),
      discountPercent: new FormControl(),
      discountAmount: new FormControl(),
      finalAmount: new FormControl()
    });

    // this.bal = this.tot - this.amp
    // console.log('this.groundregForm  : ', this.groundregForm.value);

    this.formControlValueChanged()
  }


  formControlValueChanged() {
    const discountPercent: any = this.registerForm.get('discountPercent')
    const totalAmount: any = this.registerForm.get('totalAmount')
    const finalAmount = this.registerForm.get('finalAmount')
    const discountAmount = this.registerForm.get('discountAmount')

    const balance = this.registerForm.get('balance');
    const amountPaid = this.registerForm.get('amountPaid');



    discountPercent.valueChanges.subscribe(mode => {
      let famt = (totalAmount.value * discountPercent.value) / 100
      discountAmount.setValue(famt)
      finalAmount.setValue(totalAmount.value - discountAmount.value)
      balance.setValue(finalAmount.value - amountPaid.value)

    })

    totalAmount.valueChanges.subscribe((mode: string) => {
      let famt = (totalAmount.value * discountPercent.value) / 100
      discountAmount.setValue(famt)
      finalAmount.setValue(totalAmount.value - discountAmount.value)
      balance.setValue(finalAmount.value - amountPaid.value)
    })

    amountPaid.valueChanges.subscribe(
      (mode: string) => {
        balance.setValue(finalAmount.value - amountPaid.value)
      });

    const discountPercentG: any = this.groundregForm.get('discountPercent')
    const totalAmountG: any = this.groundregForm.get('totalAmount')
    const finalAmountG = this.groundregForm.get('finalAmount')
    const discountAmountG = this.groundregForm.get('discountAmount')

    const balanceg = this.groundregForm.get('balance');
    const amountPaidG = this.groundregForm.get('amountPaid');


    discountPercentG.valueChanges.subscribe(mode => {
      let famt = (totalAmountG.value * discountPercentG.value) / 100
      discountAmountG.setValue(famt)
      finalAmountG.setValue(totalAmountG.value - discountAmountG.value)
      balanceg.setValue(finalAmountG.value - amountPaidG.value)

    })

    totalAmountG.valueChanges.subscribe((mode: string) => {
      let famt = (totalAmountG.value * discountPercentG.value) / 100
      discountAmountG.setValue(famt)
      finalAmountG.setValue(totalAmountG.value - discountAmountG.value)
      balanceg.setValue(finalAmountG.value - amountPaidG.value)
    })

    amountPaidG.valueChanges.subscribe(
      (mode: string) => {
        balanceg.setValue(finalAmountG.value - amountPaidG.value)
      });



    // this.groundregForm.get('amountPaid').valueChanges.subscribe(
    //   (mode: string) => {

    //     balanceg.setValue(this.groundregForm.get('totalAmount').value - this.groundregForm.get('amountPaid').value)

    //   });

    this.registerForm.get('mode').valueChanges.subscribe(
      (mode: string) => {
        if (mode == 'DD' || mode == 'CHEQUE' || mode == 'CARD' || mode == 'ONLINE') {
          this.isDocument = true;
        }
        else {
          this.isDocument = false
        }
      })
    this.groundregForm.get('mode').valueChanges.subscribe(
      (mode: string) => {
        if (mode == 'DD' || mode == 'CHEQUE' || mode == 'CARD' || mode == 'ONLINE') {
          this.isDocument = true;
        }
        else {
          this.isDocument = false
        }
      })
    const membership = this.registerForm.get('membership')
    membership.valueChanges.subscribe(mode => {
      membership.get('q1').get('FY').setValue(this.fyq1, { emitEvent: false })
      membership.get('q2').get('FY').setValue(this.fyq2, { emitEvent: false })
      membership.get('q3').get('FY').setValue(this.fyq3, { emitEvent: false })
      membership.get('q4').get('FY').setValue(this.fyq4, { emitEvent: false })
    })

    this.groundregForm.get('category').valueChanges.subscribe(mode => {
      if (mode == 'c') {
        let val = this.groundregForm.get('personal') as FormArray
        // val.clearValidators()
        val.get('name').clearValidators()
        val.get('name').updateValueAndValidity()

        // console.log(val.get('name'))
      }
    })

  }

  registerg(print: boolean) {
    let toastopt = {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 50
    };
    if (confirm('Are you want to really submit form')) {
      this.service.api(this.globals.ground, this.groundregForm.value).subscribe(res => {
        if (res.s) {
          // this.submited=true;
          // setTimeout(() => {
          //   this.submited = false;
          // }, 1000*5);
          // console.log(res.d)
          // console.log('res : ', res);
          let formData = Object.assign(res.d.gr, res.d.r)
          localStorage.setItem("formData", JSON.stringify(formData));
          this.notif.success(
            'Success',
            'Form Submitted...',
            toastopt
          );
          this.groundregForm.reset();
          if (this.elt.isElectronApp && print) {
            let ipcR = this.elt.ipcRenderer;
            ipcR.on('wrote-pdf', (event, path) => {
              // console.log(event);
              // console.log(path);
            });
            ipcR.send('print-to-pdf');
          } else {
            // console.log("Print Not Trigger")
          }
          window.scroll(0, 0);
          this.formDom.nativeElement.querySelector(".form-control[name='firstName']").focus();
        } else {
          console.error('Somethisg went Wrong! Please check server responce.')
        }
      }, (error) => {
        // console.log('error', error);
        if (error.d && error.d.length > 0) {
          error.d.forEach((msg: string) => {

            this.notif.error(
              'Error',
              msg,
              toastopt
            );
          });
        }
      });
    } else {
      // console.log("*msg cancel btn pressed");
    }
  }
  register(print: boolean) {
    let toastopt = {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 50
    };


    if (confirm('Are you want to really submit form')) {
      this.service.api(this.globals.register, this.registerForm.value).subscribe(res => {
        // console.log('res : ', res);
        if (res.s) {
          // this.submited=true;
          // setTimeout(() => {
          //   this.submited = false;
          // }, 1000*5);
          let formData = Object.assign(res.d.r, res.d.u)
          localStorage.setItem("formData", JSON.stringify(formData));
          this.notif.success(
            'Success',
            'Form Submitted...',
            toastopt
          );
          this.registerForm.reset();
          if (this.elt.isElectronApp && print) {
            let ipcR = this.elt.ipcRenderer;
            ipcR.on('wrote-pdf', (event, path) => {
              // console.log(event);
              // console.log(path);
            });
            ipcR.send('print-to-pdf');
          } else {
            // console.log("Print Not Trigger")
          }
          window.scroll(0, 0);
          this.formDom.nativeElement.querySelector(".form-control[name='firstName']").focus();

        } else {
          console.error('Somethisg went Wrong! Please check server responce.')
        }
      }, (error) => {
        // console.log('error', error);
        if (error.d && error.d.length > 0) {
          error.d.forEach((msg: string) => {

            this.notif.error(
              'Error',
              msg,
              toastopt
            );
          });
        }
      });
    } else {
      // console.log("*msg cancel btn pressed");
    }
  }
  changeForm(status) {
    this.sportsForm = status;
    this.isDocument = false;
  }
  type(data) {
    if (data == 'p') {
      this.personal = true
      this.company = false
    } if (data == 'c') {
      this.personal = false
      this.company = true
    }
  }
  switchInput(event) {
    let name: string = event.srcElement.name;
    let listInput = ['batch', 'time', 'firstName', 'middleName', 'lastName', 'ffullName', 'foccupation', 'anualIncome', 'mobileNo', 'resNo', 'mfullName', 'moccupation', 'mmobileNo', 'dob', 'currentClass', 'school', 'address', 'heightInCms', 'weightInKg', 'coachingCampDetail', 'repSchoolTeam', 'prevParticipation', 'otehrAreaOfInterest', 'addincharge', 'feesPaid', 'coach', 'secretary'];
    if (name) {
      let length = listInput.indexOf(name);
      // console.log('selectedSection', this.selectedSection);
      // console.log('length', length);
      if ((length != -1) && length < (listInput.length - 1)) {
        let newFocus = listInput[length + 1];
        this.formDom.nativeElement.querySelector(".form-control[name='" + newFocus + "']").focus();
      }
    }
  }

}

