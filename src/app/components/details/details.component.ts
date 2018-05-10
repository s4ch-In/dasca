import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  registerForm: FormGroup;
  edit: boolean = false
  localdata: any
  constructor(
    private formBuilder: FormBuilder,
    // private service: MasterService,
    // private globals: Globals,
    private elt: ElectronService,
    private datePipe: DatePipe,
    private routes: Router,
  ) {
    let todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.registerForm = this.formBuilder.group({
      batch: new FormControl(),
      time: new FormControl(),
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
    });

    this.localdata = JSON.parse(localStorage.getItem('detail'));
    // this.registerForm.patchValue(this.localdata);
    console.log('data', this.localdata)

  }

  ngOnInit() {
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
