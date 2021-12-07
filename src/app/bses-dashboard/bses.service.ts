import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { NormalResponses } from 'app/layouts/admin-layout/normalresponses';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SummaryDataResponse } from './summaryDataResponse';
import { DataPowerByOutages, DevicesByOutageResponse } from './devicesByOutageResponse';
import { AllDevicesByOutageResponse, AllDevicesData } from './allDeviceOutagesResponse';
import { Page, PageRequest } from 'app/paging/page';
import { delay } from 'rxjs/operators';
import { AllDevicesResponse } from 'app/bses-report/allDevicesResponse';
import { DailyLineChartResponse } from 'app/bses-report/dailyLineChartResponse';
import { DailyBarChartResponse } from 'app/bses-report/dailyBarChartResponse';
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

export interface powerOutageSurveyQuery {
  search: string,
  // shift_name: string
  data:AllDevicesByOutageResponse[];
}

export interface allDataOutageSurveyQuery {
  search: string,
  // shift_name: string
  data:AllDevicesData[];
}

@Injectable({
  providedIn: 'root'
})
export class BsesService {

  constructor(private http: HttpClient) { }

  testBaseUrl = "http://104.211.67.151:9090/BSESWebWS/api/v4/device/";

  //top cards api
  getSummaryData(input): Observable<HttpResponse<SummaryDataResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<SummaryDataResponse>(
      this.testBaseUrl + "getDailySummaryData",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  //devices card api
  getAllDevicesDataByOutages(input): Observable<HttpResponse<AllDevicesByOutageResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<AllDevicesByOutageResponse>(
      this.testBaseUrl + "getAllDevicesDataByOutRages",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  //table api
  getDevicesDetailByOutages(input): Observable<HttpResponse<DevicesByOutageResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<DevicesByOutageResponse>(
      this.testBaseUrl + "getDevicesDetailByOutrages",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  
  getAllDevices(input): Observable<HttpResponse<AllDevicesResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<AllDevicesResponse>(
      this.testBaseUrl + "getAllDevices",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  getDailySummaryDataMonthlyByDeviceId(input): Observable<HttpResponse<SummaryDataResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<SummaryDataResponse>(
      this.testBaseUrl + "getDailySummaryDataMonthlyByDeviceId",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  
  getDailyLineChart(input): Observable<HttpResponse<DailyLineChartResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<DailyLineChartResponse>(
      this.testBaseUrl + "getDailyLineChart",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }

  getDailyBarChart(input): Observable<HttpResponse<DailyBarChartResponse>> {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<DailyBarChartResponse>(
      this.testBaseUrl + "getDailyBarChart",
      input,
      {
        headers: httpHeaders,
        observe: "response",
      }
    );
  }
  

  PowerByOutagePage(
    request: PageRequest<DataPowerByOutages>, 
    query: powerOutageSurveyQuery, 
    siteList: DataPowerByOutages[]):
    Observable<Page<DataPowerByOutages>> {
    let filterSiteList = siteList;
    let { search,data } = query;

    if (search) {
      search = search.toLowerCase();

      let filterColumn: string[] = [];
      filterColumn.push("Date");
      filterColumn.push("Location");
      filterSiteList = filterSiteList.filter(function (row): boolean {
        let isFound: boolean = false;
        filterColumn.forEach((element) => {
          if (row[element].toLowerCase() == search) {
            isFound = true;
          }
        });
        return isFound;
      });
      // filterSiteList = filterSiteList.filter(
      //   s => s.shift_name.toLowerCase().includes(search),

      // );
    }


    filterSiteList = [...filterSiteList].sort((a, b) => {
      const propA = a[request.sort.property]
      const propB = b[request.sort.property]
      let result
      if (typeof propA === 'string') {
        result = propA.toLowerCase().localeCompare(propB.toString().toLowerCase())
      } else {
        result = propA as any - (propB as any)
      }
      const factor = request.sort.order === 'asc' ? 1 : -1
      return result * factor
    })
    const start = request.page * request.size;
    const end = start + request.size;
    const pageUsers = filterSiteList.slice(start, end);
    const page = {
      content: pageUsers,
      number: request.page,
      size: pageUsers.length,
      totalElements: filterSiteList.length
    };
    return of(page).pipe(delay(500));
  }


  
  AllDataOutagePage(
    request: PageRequest<AllDevicesData>, 
    query: allDataOutageSurveyQuery, 
    siteList: AllDevicesData[]):
    Observable<Page<AllDevicesData>> {
    let filterSiteList = siteList;
    let { search,data } = query;

    if (search) {
      search = search.toLowerCase();

      let filterColumn: string[] = [];
      filterColumn.push("Device");
      filterSiteList = filterSiteList.filter(function (row): boolean {
        let isFound: boolean = false;
        filterColumn.forEach((element) => {
          if (row[element].toLowerCase() == search) {
            isFound = true;
          }
        });
        return isFound;
      });
      // filterSiteList = filterSiteList.filter(
      //   s => s.shift_name.toLowerCase().includes(search),

      // );
    }


    filterSiteList = [...filterSiteList].sort((a, b) => {
      const propA = a[request.sort.property]
      const propB = b[request.sort.property]
      let result
      if (typeof propA === 'string') {
        result = propA.toLowerCase().localeCompare(propB.toString().toLowerCase())
      } else {
        result = propA as any - (propB as any)
      }
      const factor = request.sort.order === 'asc' ? 1 : -1
      return result * factor
    })
    const start = request.page * request.size;
    const end = start + request.size;
    const pageUsers = filterSiteList.slice(start, end);
    const page = {
      content: pageUsers,
      number: request.page,
      size: pageUsers.length,
      totalElements: filterSiteList.length
    };
    return of(page).pipe(delay(500));
  }
}
