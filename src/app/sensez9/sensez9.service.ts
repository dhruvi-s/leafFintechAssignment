import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { NormalResponses } from "app/layouts/admin-layout/normalresponses";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Page, PageRequest } from "app/paging/page";
import { delay } from "rxjs/operators";
import { DataUsers } from "./users/UserResponse";
import { DataTax } from "./taxpreparer/TaxPreparerResponse";
import { DataSite } from "./site/SiteResponse";
import { DataSummary, SummaryResponse } from "./summary/SummaryResponse";
import { TaxResponse } from "./taxpreparer/TaxPreparerResponse";
import { SiteResponse } from "./site/SiteResponse";
import { ZipcodeResponse } from "app/screens/models/zipcode";
import { CenterResponse } from "app/screens/models/center";
import { ScheduleTaxpreparerResponse } from "app/screens/models/schedule-taxprepare";
import {
  Appointment,
  AppointmentDetailResponse,
  AppointmentListResponse,
} from "app/screens/models/appointment";
import { TaxTypeResponse } from "app/screens/models/TaxType";
import { CitizenTypeResponse } from "app/screens/models/citizen-type";
import { NormalResponse } from "app/screens/models/normal-response";
import { DayFullResponse } from "app/screens/models/day-full";
import { AppointmentSummaryForTaxPreparers, AppointmentSummaryForTaxPreparersResponse } from "app/screens/models/appointment-summary-for-tax-preparers";
// import {
//   AppointmentSummaryForTaxPreparers,
//   AppointmentSummaryForTaxPreparersResponse,
// } from "app/screens/models/appointment-summary-for-tax-preparers";
// import { HttpResponse } from '@angular/common/http';

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

export interface UsersQuery {
  search: string;
  data: DataUsers;
}
export interface TaxQuery {
  search: string;
  data: DataTax;
}

export interface SiteQuery {
  search: string;
  data: DataSite;
}

export interface SummaryQuery {
  search: string;
  data: DataSummary;
}

export interface AppointmentByIdQuery {
  search: string;
  data: Appointment;
}

@Injectable({
  providedIn: "root",
})
export class Sensez9Service {
  constructor(private http: HttpClient) {}

  getBaseUrl = " https://swpa211.app/Sensez9Appointments1.0/api/v1/";
  deleteBaseUrl = "https://swpa211.app/Sensez9Appointments1.0/api/v1/delete/";
  addBaseUrl = "https://swpa211.app/Sensez9Appointments1.0/api/v1/create/";
  updateBasUrl = "https://swpa211.app/Sensez9Appointments1.0/api/v1/update/";
  // https://swpa211.app/Sensez9Appointments1.0/api/v1/getReScheduleCountByAppointmentId

  //Appointment
  getZipCodeListUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getZipCodeByUserId";
  getCenterListUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getSiteNameByUserIdAndZipCode";
  getScheduleTaxPrepareUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getAllScheduleForTaxPreparers";
  getAllAppointmentUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getAllAppointments";
  getAppointmentsByIdUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getAppointments";
  getTaxTypeListUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getTaxTypes";

  getCitizenTypesUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getCitizenTypes";

  addAppointmentUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/create/appointment";
  getAppointmentDetailUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getAppointmentsByAppointmentId";
  httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  getTaxPrepareBySiteIdUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getTaxPrepareBySiteId";

  getFullyBookingSummaryUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getFullyBookingSummary";

  checkExistingBookingUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/checkExistingBooking";
  checkHourlyExistingBookingUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/checkHourlyExistingBooking";

  getAppointmentSummaryForTaxPreparersUrl =
    "https://swpa211.app/Sensez9Appointments1.0/api/v1/getAppointmentSummaryForTaxPreparers";

  checkExistingBooking(input): Observable<HttpResponse<NormalResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<NormalResponse>(this.checkExistingBookingUrl, input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getAppointmentSummaryForTaxPreparers(
    input
  ): Observable<HttpResponse<AppointmentSummaryForTaxPreparersResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<AppointmentSummaryForTaxPreparersResponse>(
      this.getAppointmentSummaryForTaxPreparersUrl,
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  checkHourlyExistingBooking(input): Observable<HttpResponse<NormalResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<NormalResponse>(
      this.checkHourlyExistingBookingUrl,
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  getAppointmentsBySearchKey(input): Observable<HttpResponse<NormalResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<NormalResponse>(
      this.getBaseUrl + "getAppointmentsBySearchKey",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  uploadTaxTemplate(file, added_by) {
    let formData: FormData = new FormData();
    formData.append("PreparerCalendar", file);
    // formData.append('filename', file.name);
    formData.append("added_by", added_by);
    return this.http
      .post(this.getBaseUrl + "uploadPrepareCalendar", formData)
      .map((response: NormalResponse) => {
        return response;
      });
  }

  getReScheduleCountByAppointmentId(input) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(
      this.getBaseUrl + "getReScheduleCountByAppointmentId",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  getAppointmentsSummary(input): Observable<HttpResponse<SummaryResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<SummaryResponse>(
      this.getBaseUrl + "getAppointmentsSummary",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  getFullyBookingSummary(input): Observable<HttpResponse<DayFullResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<DayFullResponse>(
      this.getBaseUrl + "getFullyBookingSummary",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  getTaxTypes() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.getBaseUrl + "getTaxTypes", {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getUserRoles() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.getBaseUrl + "getUserRoles", {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getAllSites() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.getBaseUrl + "getAllSites", {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getUsers() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.getBaseUrl + "getAllUsers", {
      headers: httpHeaders,
      observe: "response",
    });
  }

  deleteUsers(input) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.deleteBaseUrl + "user", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  addUsers(input): Observable<HttpResponse<any>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.addBaseUrl + "user", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getZipCodeList(input): Observable<HttpResponse<ZipcodeResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<ZipcodeResponse>(this.getZipCodeListUrl, input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getAppointmentList(input): Observable<HttpResponse<AppointmentListResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<AppointmentListResponse>(
      this.getAllAppointmentUrl,
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  getAppointmentListById(
    input
  ): Observable<HttpResponse<AppointmentListResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<AppointmentListResponse>(
      this.getAppointmentsByIdUrl,
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  getCenterList(input): Observable<HttpResponse<CenterResponse>> {
    return this.http.post<CenterResponse>(this.getCenterListUrl, input, {
      headers: this.httpHeaders,
      observe: "response",
    });
  }

  getTaxTypeList(): Observable<HttpResponse<TaxTypeResponse>> {
    let input = { user_id: "1" };
    return this.http.post<TaxTypeResponse>(this.getTaxTypeListUrl, input, {
      headers: this.httpHeaders,
      observe: "response",
    });
  }

  getScheduledTaxPreparer(
    input
  ): Observable<HttpResponse<ScheduleTaxpreparerResponse>> {
    return this.http.post<ScheduleTaxpreparerResponse>(
      this.getScheduleTaxPrepareUrl,
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  getAppointmentDetail(
    input
  ): Observable<HttpResponse<AppointmentDetailResponse>> {
    return this.http.post<AppointmentDetailResponse>(
      this.getAppointmentDetailUrl,
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  updateUsers(input) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.updateBasUrl + "user", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getTax() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.getBaseUrl + "getAllTaxPrepares", {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getAllTaxPreparers(input): Observable<HttpResponse<TaxResponse>> {
    return this.http.post<TaxResponse>(
      this.getBaseUrl + "getAllTaxPrepares",
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  getAllTaxPreparersById(input): Observable<HttpResponse<TaxResponse>> {
    return this.http.post<TaxResponse>(this.getTaxPrepareBySiteIdUrl, input, {
      headers: this.httpHeaders,
      observe: "response",
    });
  }

  getSiteList(): Observable<HttpResponse<SiteResponse>> {
    let input: any = {};
    return this.http.post<SiteResponse>(
      this.getBaseUrl + "getAllSites",
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  getSiteListById(input): Observable<HttpResponse<SiteResponse>> {
    return this.http.post<SiteResponse>(
      this.getBaseUrl + "getAllSites",
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  getCitizenType(): Observable<HttpResponse<CitizenTypeResponse>> {
    let input: any = {};
    return this.http.post<CitizenTypeResponse>(this.getCitizenTypesUrl, input, {
      headers: this.httpHeaders,
      observe: "response",
    });
  }

  addAppointment(input): Observable<HttpResponse<NormalResponse>> {
    return this.http.post<NormalResponse>(this.addAppointmentUrl, input, {
      headers: this.httpHeaders,
      observe: "response",
    });
  }

  editAppointment(input): Observable<HttpResponse<NormalResponse>> {
    return this.http.post<NormalResponse>(
      this.updateBasUrl + "appointment",
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  deleteAppointment(input): Observable<HttpResponse<NormalResponse>> {
    return this.http.post<NormalResponse>(
      this.deleteBaseUrl + "appointment",
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  getUploadedTaxSchedulerCalendarXls(): Observable<
    HttpResponse<NormalResponse>
  > {
    let input: any = {};
    input.user_id = currentUser.obj.user_id;
    return this.http.post<NormalResponse>(
      "https://swpa211.app/Sensez9Appointments1.0/api/v1/getUploadedTaxSchedulerCalendarXls",
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  getAppointmentsByAppointmentId(input): Observable<any> {
    return this.http.post<any>(
      this.getBaseUrl + "getAppointmentsByAppointmentId",
      input,
      {
        headers: this.httpHeaders,
        observe: "response",
      }
    );
  }

  deleteTax(input) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.deleteBaseUrl + "user", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  addTax(input): Observable<HttpResponse<any>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.addBaseUrl + "preparer", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  updateTax(input) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.updateBasUrl + "taxPrepare", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  getSite() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.getBaseUrl + "getAllSites", {
      headers: httpHeaders,
      observe: "response",
    });
  }

  deleteSite(input) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.deleteBaseUrl + "site", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  addSite(input): Observable<HttpResponse<any>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.addBaseUrl + "site", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  updateSite(input) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(this.updateBasUrl + "Site", input, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  page(
    request: PageRequest<DataUsers>,
    query: UsersQuery,
    ruleEngineList: DataUsers[]
  ): Observable<Page<DataUsers>> {
    let filteredRuleEngineList = ruleEngineList;
    let { search, data } = query;
    if (search) {
      search = search.toLowerCase();

      filteredRuleEngineList = filteredRuleEngineList.filter(
        (s) =>
          s.username.toLowerCase().includes(search) ||
          s.first_name.toLowerCase().includes(search) ||
          s.last_name.toLowerCase().includes(search) ||
          s.zip_code.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search) ||
          s.contact_no.toLowerCase().includes(search) ||
          s.level.toLowerCase().includes(search) ||
          s.created_date.toLowerCase().includes(search)
      );
    }

    filteredRuleEngineList = [...filteredRuleEngineList].sort((a, b) => {
      const propA = a[request.sort.property];
      const propB = b[request.sort.property];
      let result;
      if (typeof propA === "string") {
        result = propA
          .toLowerCase()
          .localeCompare(propB.toString().toLowerCase());
      } else {
        result = (propA as any) - (propB as any);
      }
      const factor = request.sort.order === "asc" ? 1 : -1;
      return result * factor;
    });
    const start = request.page * request.size;
    const end = start + request.size;
    const pageUsers = filteredRuleEngineList.slice(start, end);
    const page = {
      content: pageUsers,
      number: request.page,
      size: pageUsers.length,
      totalElements: filteredRuleEngineList.length,
    };
    return of(page).pipe(delay(500));
  }

  page1(
    request: PageRequest<DataTax>,
    query: TaxQuery,
    ruleEngineList: DataTax[]
  ): Observable<Page<DataTax>> {
    let filteredRuleEngineList = ruleEngineList;
    let { search, data } = query;
    if (search) {
      search = search.toLowerCase();

      filteredRuleEngineList = filteredRuleEngineList.filter(
        (s) =>
          s.preparer_name.toLowerCase().includes(search) ||
          s.preparer_contactno.toLowerCase().includes(search) ||
          s.preparer_zipcode.toLowerCase().includes(search) ||
          s.preparer_email.toLowerCase().includes(search) ||
          s.created_date.toLowerCase().includes(search)
      );
    }

    filteredRuleEngineList = [...filteredRuleEngineList].sort((a, b) => {
      const propA = a[request.sort.property];
      const propB = b[request.sort.property];
      let result;
      if (typeof propA === "string") {
        result = propA
          .toLowerCase()
          .localeCompare(propB.toString().toLowerCase());
      } else {
        result = (propA as any) - (propB as any);
      }
      const factor = request.sort.order === "asc" ? 1 : -1;
      return result * factor;
    });
    const start = request.page * request.size;
    const end = start + request.size;
    const pageUsers = filteredRuleEngineList.slice(start, end);
    const page = {
      content: pageUsers,
      number: request.page,
      size: pageUsers.length,
      totalElements: filteredRuleEngineList.length,
    };
    return of(page).pipe(delay(500));
  }

  page2(
    request: PageRequest<DataSite>,
    query: SiteQuery,
    ruleEngineList: DataSite[]
  ): Observable<Page<DataSite>> {
    let filteredRuleEngineList = ruleEngineList;
    let { search, data } = query;
    if (search) {
      search = search.toLowerCase();

      filteredRuleEngineList = filteredRuleEngineList.filter(
        (s) =>
          s.site_name.toLowerCase().includes(search) ||
          s.zip_code.toLowerCase().includes(search) ||
          s.created_date.toLowerCase().includes(search)
      );
    }

    filteredRuleEngineList = [...filteredRuleEngineList].sort((a, b) => {
      const propA = a[request.sort.property];
      const propB = b[request.sort.property];
      let result;
      if (typeof propA === "string") {
        result = propA
          .toLowerCase()
          .localeCompare(propB.toString().toLowerCase());
      } else {
        result = (propA as any) - (propB as any);
      }
      const factor = request.sort.order === "asc" ? 1 : -1;
      return result * factor;
    });
    const start = request.page * request.size;
    const end = start + request.size;
    const pageUsers = filteredRuleEngineList.slice(start, end);
    const page = {
      content: pageUsers,
      number: request.page,
      size: pageUsers.length,
      totalElements: filteredRuleEngineList.length,
    };
    return of(page).pipe(delay(500));
  }

  page3(
    request: PageRequest<DataSummary>,
    query: SummaryQuery,
    ruleEngineList: DataSummary[]
  ): Observable<Page<DataSummary>> {
    let filteredRuleEngineList = ruleEngineList;
    let { search, data } = query;
    if (search) {
      search = search.toLowerCase();

      filteredRuleEngineList = filteredRuleEngineList.filter(
        (s) =>
          s.total_hours.toLowerCase().includes(search) ||
          s.total_hours_booked.toLowerCase().includes(search) ||
          s.booking_percentage.toLowerCase().includes(search) ||
          s.total_hours_available.toLowerCase().includes(search)
      );
    }

    filteredRuleEngineList = [...filteredRuleEngineList].sort((a, b) => {
      const propA = a[request.sort.property];
      const propB = b[request.sort.property];
      let result;
      if (typeof propA === "string") {
        result = propA
          .toLowerCase()
          .localeCompare(propB.toString().toLowerCase());
      } else {
        result = (propA as any) - (propB as any);
      }
      const factor = request.sort.order === "asc" ? 1 : -1;
      return result * factor;
    });
    const start = request.page * request.size;
    const end = start + request.size;
    const pageUsers = filteredRuleEngineList.slice(start, end);
    const page = {
      content: pageUsers,
      number: request.page,
      size: pageUsers.length,
      totalElements: filteredRuleEngineList.length,
    };
    return of(page).pipe(delay(500));
  }

  page4(
    request: PageRequest<Appointment>,
    query: AppointmentByIdQuery,
    ruleEngineList: Appointment[]
  ): Observable<Page<Appointment>> {
    let filteredRuleEngineList = ruleEngineList;
    let { search, data } = query;
    if (search) {
      search = search.toLowerCase();

      filteredRuleEngineList = filteredRuleEngineList.filter(
        (s) =>
          s.client_name.toLowerCase().includes(search) ||
          s.client_email.toLowerCase().includes(search) ||
          s.appointment_date.toLowerCase().includes(search) ||
          s.created_date.toLowerCase().includes(search)
      );
    }

    filteredRuleEngineList = [...filteredRuleEngineList].sort((a, b) => {
      const propA = a[request.sort.property];
      const propB = b[request.sort.property];
      let result;
      if (typeof propA === "string") {
        result = propA
          .toLowerCase()
          .localeCompare(propB.toString().toLowerCase());
      } else {
        result = (propA as any) - (propB as any);
      }
      const factor = request.sort.order === "asc" ? 1 : -1;
      return result * factor;
    });
    const start = request.page * request.size;
    const end = start + request.size;
    const pageUsers = filteredRuleEngineList.slice(start, end);
    const page = {
      content: pageUsers,
      number: request.page,
      size: pageUsers.length,
      totalElements: filteredRuleEngineList.length,
    };
    return of(page).pipe(delay(500));
  }

  page5(
    request: PageRequest<AppointmentSummaryForTaxPreparers>,
    query: SummaryQuery,
    ruleEngineList: AppointmentSummaryForTaxPreparers[]
  ): Observable<Page<AppointmentSummaryForTaxPreparers>> {
    let filteredRuleEngineList = ruleEngineList;
    let { search, data } = query;
    if (search) {
      search = search.toLowerCase();

      filteredRuleEngineList = filteredRuleEngineList.filter(
        (s) =>
          s.total_hours.toLowerCase().includes(search) ||
          s.total_hours_booked.toLowerCase().includes(search) ||
          s.booking_percentage.toLowerCase().includes(search) ||
          s.total_hours_available.toLowerCase().includes(search)
      );
    }

    filteredRuleEngineList = [...filteredRuleEngineList].sort((a, b) => {
      const propA = a[request.sort.property];
      const propB = b[request.sort.property];
      let result;
      if (typeof propA === "string") {
        result = propA
          .toLowerCase()
          .localeCompare(propB.toString().toLowerCase());
      } else {
        result = (propA as any) - (propB as any);
      }
      const factor = request.sort.order === "asc" ? 1 : -1;
      return result * factor;
    });
    const start = request.page * request.size;
    const end = start + request.size;
    const pageUsers = filteredRuleEngineList.slice(start, end);
    const page = {
      content: pageUsers,
      number: request.page,
      size: pageUsers.length,
      totalElements: filteredRuleEngineList.length,
    };
    return of(page).pipe(delay(500));
  }
}
