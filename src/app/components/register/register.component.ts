import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { Globals } from './../../globals';
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { DatePipe } from '@angular/common';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';

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
  bal: number
  tot: number = 0
  amp: number = 0
  totalAmount: FormControl
  @ViewChild('formDom') formDom: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private service: MasterService,
    private datePipe: DatePipe,
    private globals: Globals,
    private elt: ElectronService,
    private routes: Router,
    // private toast :ToastsManager,
    // vcr: ViewContainerRef
    private notif: NotificationsService,
  ) {
    // this.toast.setRootViewContainerRef(vcr);

    // console.log('printer : ', printer);
    //let todayDate = this.datePipe.transform(new Date(), 'shortTime');
    // this.totalAmount = new FormControl('', Validators.required)
    // this.amountPaid = new FormControl('', Validators.required)
    this.registerForm = this.formBuilder.group({
      batch: new FormControl('MORNING'),
      time: new FormControl(),
      membership: new FormGroup({
        q1: new FormControl(''),
        q2: new FormControl(''),
        q3: new FormControl(''),
        q4: new FormControl(''),
      }),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(),
      lastName: new FormControl('', Validators.required),
      father: new FormGroup({
        ffullName: new FormControl('', Validators.required),
        foccupation: new FormControl(),
        anualIncome: new FormControl(),
        mobileNo: new FormControl('', Validators.required),
        resNo: new FormControl(),
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
      heightInCms: new FormControl(),
      weightInKg: new FormControl(),
      coachingCampDetail: new FormControl(),
      repSchoolTeam: new FormControl(),
      prevParticipation: new FormControl(),
      otehrAreaOfInterest: new FormControl(),
      addincharge: new FormControl('', Validators.required),
      feesPaid: new FormControl('', Validators.required),
      coach: new FormControl(),
      secretary: new FormControl(),
      totalAmount: new FormControl(0, Validators.required),
      amountPaid: new FormControl(0, Validators.required),
      balance: new FormControl(0, Validators.required),
      narration: new FormControl('', Validators.required),
      mode: new FormControl('CASH', Validators.required)

    });

  }
  ngAfterViewInit() {
    this.formDom.nativeElement.querySelector(".form-control[name='firstName']").focus();
    // console.log('route : ', );
  }
  ngOnInit() {

    this.groundregForm = this.formBuilder.group({
      dateFromTo: new FormControl(),
      regNo: new FormControl,
      narration: new FormControl(),
      balance: new FormControl(),
      totalAmount: new FormControl(0, Validators.required),
      amountPaid: new FormControl(0, Validators.required),
      personal: new FormGroup({
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
      category: new FormControl('p', Validators.required),
      mode: new FormControl('CASH', Validators.required)

    });

    // this.bal = this.tot - this.amp
    // console.log('this.groundregForm  : ', this.groundregForm.value);

    this.formControlValueChanged()
  }

  formControlValueChanged() {
    const balance = this.registerForm.get('balance');
    this.registerForm.get('totalAmount').valueChanges.subscribe(
      (mode: string) => {
        // if (mode == 'c') {
        //   balance.setValidators([Validators.required])
        // } else if (mode == 'p') {
        //   balance.clearValidators()
        // }
        balance.setValue(this.registerForm.get('totalAmount').value - this.registerForm.get('amountPaid').value)

      });
  }
  registerg() {
  }
  register(print: boolean) {
    // console.log('form.value :',form.value);
    let toastopt = {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 50
    };

    localStorage.setItem("formData", JSON.stringify(this.registerForm.value));
    if (confirm('Are you want to really submit form')) {
      this.service.api(this.globals.register, this.registerForm.value).subscribe(res => {
        console.log('res : ', res);
        if (res.s) {
          // this.submited=true;
          // setTimeout(() => {
          //   this.submited = false;
          // }, 1000*5);
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
            console.log("Print Not Trigger")
          }
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
      console.log("*msg cancel btn pressed");
    }
  }
  changeForm(status) {
    this.sportsForm = status;
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

