import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

import {Observable} from "rxjs/Observable";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private _http: HttpClient) { }

 dailyForecast() {
    // return this._http.get("http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22")
    //   .map(result => result);


// this._http.post('http://104.211.67.151/Asbury_Hights/getCurrentTempBeacon',
//             {
//               'client_id': '37'
//             })
//             .subscribe(
//                 (val) => {
//                     console.log("POST call successful value returned in body", val);
//                 },
//                 response => {
//                     console.log("POST call in error", response);
//                 },
//                 () => {
//                     console.log("The POST observable is now completed.");
//                 });


   }

}
