import { Observable } from 'rxjs/Observable';
import { NormalResponses, } from 'app/layouts/admin-layout/normalresponses';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

const httpHeaders = new HttpHeaders({
  'Content-Type': 'application/json'
});
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  baseUrl = environment.baseUrl;
  validateUserNameUrl = this.baseUrl + '/Asbury_Hights1/validate_user_name';
  constructor(private http: HttpClient) { }

  userName(username: string) {
    return this.http.get<NormalResponses>(
      this.validateUserNameUrl, {
      params: new HttpParams().set('user_name', username)
    }
    );
  }
}
