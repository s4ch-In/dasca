import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../../services/master.service';
import { Globals } from './../../globals';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  registerForm: FormGroup;
  paymentForm: FormGroup;
  newReceiptForm: FormGroup;
  edit: boolean = false
  localdata: any
  receiptData: any
  formState: string
  groundata: any = {};
  payBtn: boolean = false
  balance: any
  modalRef: BsModalRef;
  category: string
  regId: any = ''
  userId: any = ''
  isDocument: boolean = false
  membership: any
  userDob: any
  @ViewChild('template') payTemp: TemplateRef<any>
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  q1Status: boolean
  q2Status: boolean
  q3Status: boolean
  q4Status: boolean
  receiptList: any
  date: Date = new Date
  dy: number = this.date.getFullYear()
  currentMonth = this.date.getMonth() + 1
  fyq1: any = this.dy + '-' + (this.dy + 1)
  fyq2: any = this.dy + '-' + (this.dy + 1)
  fyq3: any = this.dy + '-' + (this.dy + 1)
  fyq4: any = (this.dy + 1) + '-' + (this.dy + 2)
  sdob: any
  constructor(
    private formBuilder: FormBuilder,
    // private service: MasterService,
    // private globals: Globals,
    private elt: ElectronService,
    private datePipe: DatePipe,
    private routes: Router,
    private modalService: BsModalService,
    private service: MasterService,
    private globals: Globals,
    private notif: NotificationsService,
  ) {
    let todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');


    this.formState = localStorage.getItem('formState');



    // this.groundata.balance = 800
    // localStorage.setItem('groundData', JSON.stringify(this.groundata))

    if (this.formState == 'ground') {
      this.groundata = JSON.parse(localStorage.getItem('groundData'));
      console.log(this.groundata.receipts)
      this.category = "G"
      this.balance = this.groundata.balance
      this.regId = this.groundata.regId
    }
    else if (this.formState == 'sports') {
      let combo = JSON.parse(localStorage.getItem('detail'))
      this.localdata = Object.assign(combo.e, combo.doc)
      this.localdata.dob = this.datePipe.transform(this.localdata.dob, 'dd-MM-yyyy')
      this.sdob = this.localdata.dob
      this.receiptList = this.localdata.r
      this.category = "S"
      this.balance = this.localdata.balance
      this.userId = this.localdata.userId
      this.membership = this.localdata.membership
      // this.userDob = this.datePipe.transform(this.localdata.dob, 'dd-MM-yyyy')

    }
    else if (this.formState == 'receipt') {
      this.receiptData = JSON.parse(localStorage.getItem('recData'));
      console.log(this.receiptData)
    }
    else if (!this.formState) {
      console.log('No formstate')
    }


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
      dob: new FormControl(this.sdob, Validators.required),
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
      finalAmount: new FormControl()
    });
    if (this.formState == 'sports') {
      this.registerForm.patchValue(this.localdata);
    }
    if (this.balance != '') {
      this.payBtn = true
    }
    this.paymentForm = this.formBuilder.group({
      regId: new FormControl(this.regId),
      totalAmount: new FormControl(this.balance, Validators.required),
      amountPaid: new FormControl(0, Validators.required),
      balance: new FormControl(0, Validators.required),
      narration: new FormControl('', Validators.required),
      mode: new FormControl('CASH', Validators.required),
      category: new FormControl(this.category),
      userId: new FormControl(this.userId),
      finalAmount: new FormControl(this.balance, Validators.required),
      document: new FormGroup({
        no: new FormControl(),
        bank: new FormControl(),
        date: new FormControl()
      }),
    })
    // this.newReceiptInit()
    this.newReceiptForm = this.formBuilder.group({
      regId: new FormControl(this.regId),
      membership: new FormGroup({
        q1: new FormGroup({
          status: new FormControl(false),
          FY: new FormControl(),
        }),
        q2: new FormGroup({
          status: new FormControl(false),
          FY: new FormControl(),
        }),
        q3: new FormGroup({
          status: new FormControl(false),
          FY: new FormControl(),
        }),
        q4: new FormGroup({
          status: new FormControl(false),
          FY: new FormControl(),
        }),
      }),
      sport: new FormControl('Cricket', Validators.required),
      totalAmount: new FormControl(0, Validators.required),
      amountPaid: new FormControl(0, Validators.required),
      balance: new FormControl(0, Validators.required),
      narration: new FormControl('', Validators.required),
      mode: new FormControl('CASH', Validators.required),
      category: new FormControl(this.category),
      userId: new FormControl(this.userId),
      document: new FormGroup({
        no: new FormControl(),
        bank: new FormControl(),
        date: new FormControl()
      }),
      discountPercent: new FormControl(),
      discountAmount: new FormControl(),
      finalAmount: new FormControl()
    })
  }


  findByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  }

  addNewReceipt() {
    // console.log(this.newReceiptForm.value)
    this.modalRef.hide()
    let toastopt = {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 50
    };

    if (confirm('Are you want to really print form')) {
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
      this.service.api(this.globals.newReceipt, this.newReceiptForm.value).subscribe(res => {
        if (res.s) {
          //update groundata object
          console.log(res)
          this.localdata.balance = this.newReceiptForm.value.balance
          this.localdata.finalAmount = this.newReceiptForm.value.finalAmount
          this.localdata.amountPaid = this.newReceiptForm.value.amountPaid
          this.localdata.narration = this.newReceiptForm.value.narration
          localStorage.setItem('detail', JSON.stringify(this.localdata))
          this.registerForm.patchValue(this.localdata);
          this.notif.success(
            'Success',
            'Form Submitted...',
            toastopt
          );
          this.newReceiptForm.reset();
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
          console.error('Somethisg went Wrong! Please chech server responce.')
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

  paySport() {
    this.modalRef.hide()
    let toastopt = {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 50
    };

    if (confirm('Are you want to really print form')) {
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
      this.service.api(this.globals.payb, this.paymentForm.value).subscribe(res => {
        if (res.s) {
          //update groundata object
          console.log(res)
          this.localdata.balance = this.paymentForm.value.balance
          this.localdata.finalAmount = this.paymentForm.value.finalAmount
          this.localdata.amountPaid = this.paymentForm.value.amountPaid
          this.localdata.narration = this.paymentForm.value.narration
          this.balance = this.paymentForm.value.balance
          this.paymentForm.reset()
          this.paymentForm.get('finalAmount').setValue(this.balance);
          localStorage.setItem('detail', JSON.stringify(this.localdata))
          let formData = Object.assign({}, res.d.user, res.d)
          localStorage.setItem("formData", JSON.stringify(formData));
          this.registerForm.patchValue(this.localdata);
          this.notif.success(
            'Success',
            'Form Submitted...',
            toastopt
          );
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
          console.error('Somethisg went Wrong! Please chech server responce.')
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

  ngOnInit() {
    this.formControlValueChanged()
  }
  formControlValueChanged() {

    const discountPercent: any = this.newReceiptForm.get('discountPercent')
    const totalAmount: any = this.newReceiptForm.get('totalAmount')
    const finalAmount = this.newReceiptForm.get('finalAmount')
    const discountAmount = this.newReceiptForm.get('discountAmount')

    const balance = this.newReceiptForm.get('balance');
    const amountPaid = this.newReceiptForm.get('amountPaid');



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

    this.newReceiptForm.get('mode').valueChanges.subscribe(
      (mode: string) => {

        if (mode == 'DD' || mode == 'CHEQUE' || mode == 'CARD' || mode == 'ONLINE') {
          this.isDocument = true;
        }
        else {
          this.isDocument = false
        }
      })

    this.paymentForm.get('mode').valueChanges.subscribe(
      (mode: string) => {

        if (mode == 'DD' || mode == 'CHEQUE' || mode == 'CARD' || mode == 'ONLINE') {
          this.isDocument = true;
        }
        else {
          this.isDocument = false
        }
      })

    //PaymentForm calculations
    const balanceg = this.paymentForm.get('balance');
    this.paymentForm.get('amountPaid').valueChanges.subscribe(
      (mode: string) => {

        balanceg.setValue(this.paymentForm.get('finalAmount').value - this.paymentForm.get('amountPaid').value)
      });
    // this.paymentForm.get('finalAmount').valueChanges.subscribe(
    //   (mode: string) => {

    //     balanceg.setValue(this.paymentForm.get('finalAmount').value - this.paymentForm.get('amountPaid').value)
    //   });

  }

  pay() {

    this.modalRef.hide()
    let toastopt = {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 50
    };

    if (confirm('Are you want to really print form')) {
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
      this.service.api(this.globals.payb, this.paymentForm.value).subscribe(res => {
        if (res.s) {
          //update groundata object
          console.log(res)
          this.groundata.balance = this.paymentForm.value.balance
          this.groundata.totalAmount = this.paymentForm.value.totalAmount
          // this.localdata.finalAmount = this.paymentForm.value.finalAmount
          this.groundata.amountPaid = this.paymentForm.value.amountPaid
          this.groundata.narration = this.paymentForm.value.narration
          this.balance = this.paymentForm.value.balance
          this.paymentForm.reset()
          localStorage.setItem('groundData', JSON.stringify(this.groundata))
          console.log('resd', res.d)
          let formData = Object.assign({}, res.d.ground.company, res.d.ground.person, res.d.ground, res.d)
          localStorage.setItem("formData", JSON.stringify(formData));
          this.paymentForm.get('finalAmount').setValue(this.balance);
          this.notif.success(
            'Success',
            'Form Submitted...',
            toastopt
          );
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
          console.error('Somethisg went Wrong! Please chech server responce.')
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
    if (confirm('Are you want to really print form')) {
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
      // this.service.api(this.globals.register, this.registerForm.value).subscribe(res=>{
      //   console.log('res : ', res);
      //   if(res.s){

      //     this.notif.success(
      //       'Success',
      //       'Form Submitted...',
      //       toastopt
      //     );
      //     this.registerForm.reset();
      //     if (this.elt.isElectronApp && print) {
      //       let ipcR = this.elt.ipcRenderer;
      //       ipcR.on('wrote-pdf', (event, path) => {
      //         // console.log(event);
      //         // console.log(path);
      //       });
      //       ipcR.send('print-to-pdf');
      //     }else{
      //       console.log("Print Not Trigger")
      //     }
      //   }else{
      //     console.error('Somethisg went Wrong! Please chech server responce.')
      //   }
      // },(error)=>{
      //   // console.log('error', error);
      //   if(error.d && error.d.length>0){
      //     error.d.forEach((msg:string) => {

      //       this.notif.error(
      //         'Error',
      //         msg,
      //         toastopt
      //       );
      //     });
      //   }
      // });
    } else {
      console.log("*msg cancel btn pressed");
    }
  }

}
