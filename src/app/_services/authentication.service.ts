import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { environment } from "environments/environment";
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(login: any) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(
     // environment.baseUrl + "Asbury_Hights1/angular_user_login",
      "https://swpa211.app/Sensez9Appointments1.0/api/v1/userlogin",

      { username: login.email, password: login.password, client_id: "gaia-account-manager", client_secret: "gaia-account-manager", grant_type: "password",},
      {
        headers: httpHeaders,
      }
    );
    // .map(user => {

    //   // login successful if there's a jwt token in the response
    //   if (user && user.token) {
    //     // store user details and jwt token in local storage to keep user logged in between page refreshes
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //   }

    //   return user;
    // });
  }

  // getGeneratereports(fromdate: String, todate: String): Observable<HttpResponse<TemperaturetRportsResponse>> {

  //   console.log('FromDate' + fromdate);
  //   console.log('ToDate' + todate);

  //   const httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.post<TemperaturetRportsResponse>(this.getGeneratereportsUrl,

  //     {
  //       'client_id': '37',
  //       'user_id': '250',
  //       'from_date': fromdate,
  //       'to_date': todate,
  //     }
  //     ,
  //     {
  //       headers: httpHeaders,
  //       observe: 'response'
  //     }
  //   );
  // };

  logout(): void {
    // remove user from local storage to log user out
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("currentUser");
  }
}
