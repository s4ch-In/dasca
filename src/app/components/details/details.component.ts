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

  //Receipt Defines
  recId: any
  recUserId: any
  recName: any
  recMobile: any
  recDob: any
  recCaste: any
  recSchool: any
  recCompany: any
  recPaidFor: any

  recTotalAmount: any
  recAmountPaid: any
  recDiscountAmount: any
  recDiscountPercent: any
  recFinalAmount: any
  recBalance: any
  q1: string
  q2: string
  q3: string
  q4: string
  img: string
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
      let recd = JSON.parse(localStorage.getItem('recData'));
      console.log(recd)
      if (recd.ground) {
        this.receiptData = Object.assign({}, recd.ground, recd)
        this.recId = this.receiptData.receiptId
        this.recUserId = ''
        this.recName = this.receiptData.name
        if (this.receiptData.company.contactNo) {
          this.recMobile = this.receiptData.company.contactNo
        }
        else {
          this.recMobile = this.receiptData.person.contactNo
        }
        this.recDob = ''
        this.recCaste = ''
        this.recSchool = ''
        this.recPaidFor = this.receiptData.category
        this.recTotalAmount = this.receiptData.totalAmount
        this.recFinalAmount = this.receiptData.finalAmount
        this.recAmountPaid = this.receiptData.amountPaid
        this.recDiscountAmount = this.receiptData.discountAmount
        this.recDiscountPercent = this.receiptData.discountPercent
        this.recBalance = this.receiptData.balance
      } else {
        this.receiptData = Object.assign({}, recd.user, recd)

        this.recId = this.receiptData.receiptId
        this.recUserId = this.receiptData.userId
        this.recName = this.receiptData.name
        this.recMobile = this.receiptData.mobileNo
        this.recDob = this.receiptData.dob
        this.recCaste = this.receiptData.caste
        this.recSchool = this.receiptData.school
        this.recPaidFor = this.receiptData.category
        this.recTotalAmount = this.receiptData.totalAmount
        this.recFinalAmount = this.receiptData.finalAmount
        this.recAmountPaid = this.receiptData.amountPaid
        this.recDiscountAmount = this.receiptData.discountAmount
        this.recDiscountPercent = this.receiptData.discountPercent
        this.recBalance = this.receiptData.balance

        if (this.receiptData.membership) {
          this.q1 = this.findByKey(this.receiptData.membership, 'quarter', 'q1')
          this.q2 = this.findByKey(this.receiptData.membership, 'quarter', 'q2')
          this.q3 = this.findByKey(this.receiptData.membership, 'quarter', 'q3')
          this.q4 = this.findByKey(this.receiptData.membership, 'quarter', 'q4')
          console.log('membership', this.receiptData.membership)
        }
      }
      console.log(this.receiptData)
      this.img = "data:image/png;base64,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"
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

      this.service.api(this.globals.payb, this.paymentForm.value).subscribe(res => {
        if (res.s) {
          //update groundata object
          console.log(res)
          this.localdata.balance = this.paymentForm.value.balance

          this.localdata.finalAmount = this.paymentForm.value.finalAmount
          this.localdata.totalAmount = this.paymentForm.value.finalAmount
          this.localdata.amountPaid = this.paymentForm.value.amountPaid
          this.localdata.narration = this.paymentForm.value.narration
          this.balance = this.paymentForm.value.balance
          this.category = this.paymentForm.value.category
          this.userId = this.paymentForm.value.userId
          this.paymentForm.reset()
          this.paymentForm.get('totalAmount').setValue(this.localdata.totalAmount)
          this.paymentForm.get('userId').setValue(this.userId)
          this.paymentForm.get('finalAmount').setValue(this.balance);
          this.paymentForm.get('category').setValue(this.category);
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
          this.category = this.paymentForm.value.category
          this.regId = this.paymentForm.value.regId
          this.paymentForm.reset()

          this.paymentForm.get('totalAmount').setValue(this.groundata.finalAmount)
          this.paymentForm.get('regId').setValue(this.regId)
          localStorage.setItem('groundData', JSON.stringify(this.groundata))
          this.paymentForm.get('category').setValue(this.category);
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
      // if (this.elt.isElectronApp && print) {
      //   let ipcR = this.elt.ipcRenderer;
      //   ipcR.on('wrote-pdf', (event, path) => {
      //     // console.log(event);
      //     // console.log(path);
      //   });
      //   ipcR.send('print-to-pdf');
      // } else {
      //   console.log("Print Not Trigger")
      // }
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
