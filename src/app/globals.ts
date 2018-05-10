import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  constructor(
  ) { }
  url: string = 'localhost:1191';
  // url: string ='192.168.0.100:1191'; //netgear server
  // url: string = '192.168.0.102:1191'; //niraj netgear
  webSocketUrl: string = 'ws://' + this.url + '/';
  api: string = 'http://' + this.url + '/';
  register: object = { url: this.api + 'user', method: "POST" };
  list: object = { url: this.api + 'user', method: "GET" };

}