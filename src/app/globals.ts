import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  constructor(
  ) { }
  // url: string = 'localhost:1191';
  // url: string ='192.168.0.100:1191'; //netgear server
  url: string = '192.168.0.102:1191'; //niraj netgear
  webSocketUrl: string = 'ws://' + this.url + '/';
  api: string = 'http://' + this.url + '/';
  register: object = { url: this.api + 'user', method: "POST" };
  ground: object = { url: this.api + 'ground', method: "POST" };
  groundList: object = { url: this.api + 'ground', method: "GET" };
  list: object = { url: this.api + 'user', method: "GET" };
  receipt: object = { url: this.api + 'receipt', method: "GET" };
  payb: object = { url: this.api + 'receipt', method: "POST" };
  newReceipt: object = { url: this.api + 'register', method: "POST" };


}