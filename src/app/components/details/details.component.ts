import { Component, OnInit, TemplateRef } from '@angular/core';
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
  edit: boolean = false
  localdata: any
  formState: string
  groundata: any;
  payBtn: boolean = false
  balance: any
  modalRef: BsModalRef;
  category: string
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
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

    this.registerForm = this.formBuilder.group({
      batch: new FormControl('MORNING'),
      time: new FormControl(),
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
    });

    this.localdata = JSON.parse(localStorage.getItem('detail'));
    this.registerForm.patchValue(this.localdata);
    this.formState = localStorage.getItem('formState');
    this.groundata = JSON.parse(localStorage.getItem('groundData'));
    console.log('data', this.localdata)


    if (this.formState == 'ground') {
      this.category = "G"
      this.balance = this.groundata.balance
    }
    else {
      this.category = "S"
      this.balance = this.localdata.balance
      console.log(this.balance)
    }
    if (this.balance != '') {
      this.payBtn = true
    }
    this.paymentForm = this.formBuilder.group({
      regId: new FormControl(this.groundata.regId),
      totalAmount: new FormControl(this.balance, Validators.required),
      amountPaid: new FormControl(0, Validators.required),
      balance: new FormControl(0, Validators.required),
      narration: new FormControl('', Validators.required),
      mode: new FormControl('CASH', Validators.required),
      category: new FormControl(this.category),
      userId: new FormControl(this.localdata.userId)
    })

  }

  ngOnInit() {
    this.formControlValueChanged()
  }
  formControlValueChanged() {

    const balanceg = this.paymentForm.get('balance');
    this.paymentForm.get('amountPaid').valueChanges.subscribe(
      (mode: string) => {

        balanceg.setValue(this.paymentForm.get('totalAmount').value - this.paymentForm.get('amountPaid').value)
      });

  }
  pay() {
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
      this.service.api(this.globals.abc, this.paymentForm.value).subscribe(res => {
        console.log('this')
        if (res.s) {
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
