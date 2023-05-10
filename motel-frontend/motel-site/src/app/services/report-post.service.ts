import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReportPost } from "../model/report-post";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ReportPostService { 

    private apiUrl = '/api';

    constructor(private http: HttpClient) {

    }

    addReportPost(reportPost: ReportPost) : Observable<ReportPost> {
        return this.http.post<ReportPost>(`${this.apiUrl}/report-posts`, reportPost);

    }
}