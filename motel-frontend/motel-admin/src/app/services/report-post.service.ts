import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReportPost } from "../model/report-post";
import { Page } from "../model/page";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class ReportPostService {
    
    private apiUrl = '/api';
    
    constructor(private http: HttpClient) {
    }

    getAllReport(page: number, pageSize: number) : Observable<Page<ReportPost>>{
        return this.http.get<Page<ReportPost>>(`${this.apiUrl}/report-posts?page=${page}`
        + `&size=${pageSize}`);
    }

    removeReports(reportIds: number[]) {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: reportIds
      };
      return this.http.delete(`${this.apiUrl}/report-posts`, options)
    }
}