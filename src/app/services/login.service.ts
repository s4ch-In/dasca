import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, RequestMethod } from '@angular/http';


@Injectable()
export class LoginService {

  constructor(
    private http: Http
  ) { }
  user: any = {
    s: true,
    m: 'User logged In'
  }
  unf: any = {
    s: false,
    m: "Incorrect username or password"
  }

  password: string = "password"
  authenticate(password) {
    console.log(password)
    // return this.arr2
    // return this.http.post(api, { 'username': username, 'password': password })
    //   .map(res => res.json())
    if (this.password === password) {
      return this.user
    }
    else {
      return this.unf
    }
  }


}
