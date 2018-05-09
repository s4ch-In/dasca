import { Injectable, Output, EventEmitter } from '@angular/core';
// import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Globals } from '../globals';
import { Headers, Http, Response, ResponseOptions, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';

@Injectable()
export class MasterService {
  constructor(
    public globals: Globals,
    private http: Http,
  ) {

  }


  api(request, data = {}) {
    let options = new RequestOptions();
    // options.withCredentials = true;
    // header("Cache-Control: no-cache,no-store");

    // options.headers = new Headers();
    // options.headers.append("Cache-Control","no-cache,no-store");
    if (request.method == "GET") {

      return this.http.get(this.queryString(request, data), options)
        .map(res => {

          return res.json();
        })
        .catch((res: any) => {
          if (res.status == 404) {
            console.log("page not found..!");
          }
          if (res.status == 500) {
            console.log("Internal Server Error..!", res.json());
          }
          return Observable.throw(res.json());
        }
        );
    } else if (request.method == "POST") {

      return this.http.post(request.url, data, options)
        .map(res => {
          return res.json();
        })
        .catch((res: any) => {
          if (res.status == 404) {
            console.log("page not found..!");
          }
          if (res.status == 500) {
            // console.log("Internal Server Error..!", res.json());  
          }
          return Observable.throw(res.json());
        }
        );

    }
  }

  queryString(request, data) {
    let myQuery = request.url + '?'
    for (let entry in data) {
      myQuery += entry + '=' + encodeURIComponent(data[entry]) + '&';
    }
    // remove last '&'
    myQuery = myQuery.substring(0, myQuery.length - 1)
    return myQuery;
  }

  getList(request, data): Observable<any> {
    let options = new RequestOptions();
    return this.http.get(this.queryString(request, data), options)
      .map((response: Response) => <any>response.json().d)
      .do(data => {
        console.log(data);
      })
      .catch((res: any) => {
        if (res.status == 404) {
          console.log("page not found..!");
        }
        return Observable.throw(res);
      }
      );
  }


  errorHandler(error: any): void {
    console.log(error)
  }

}
