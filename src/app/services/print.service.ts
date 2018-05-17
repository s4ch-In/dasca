import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
export interface formData {
  name: any;
}

@Injectable()
export class PrintService {

  constructor() { }

  print(data) {
    // console.log("%c Data %s", 'color: green; font-weight: bold;', JSON.stringify(data))
    // data.catch(e => {
    //   if (e.test) {
    //     console.log(e.test)
    //   } else {
    //     return Observable.throw(
    //       // new Error(`${e.status} ${e.statusText}`)
    //       new Error(`test is not defined`)
    //     );
    //   }
    // })
    try {
      // console.log(data.test)
      return data.test
    } catch (error) {
      console.log(error);
    }

  }


  // sharingData = <formData>{ name: "nyks" };
  // print(data) {
  //   console.log('save data function called' + JSON.stringify(data) + this.sharingData.name);
  //   this.sharingData.name = data.name;
  // }
  // getData() {
  //   console.log('get data function called');
  //   return this.sharingData.name;
  // }

}
