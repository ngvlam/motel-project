import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "@stomp/stompjs";
import { AuthService } from "./auth.service";
import { Notification } from "../model/notification";
import { Page } from "../model/page";

@Injectable({
    providedIn: 'root'
})

export class NotificationService { 

    private apiUrl = '/api';

    notification: Notification = new Notification()

    constructor(private http: HttpClient, private authService: AuthService) {
        
    }

    getNotification(page: number, size: number): Observable<Page<Notification>> {
        return this.http.get<Page<Notification>>(this.apiUrl + '/notifications?page=' + page + '&size=' + size);
    }

    getNotificationBySeen(page: number, seen: string, size: number) : Observable<Page<Notification>> {
        return this.http.get<Page<Notification>>(this.apiUrl + '/notifications?page=' + page + '&size=' + size + '&seen=' + seen);
    }

    seenNotification(notifId: number) : Observable<Notification>{
        return this.http.put<Notification>(this.apiUrl + '/notifications/' + notifId, null);

    }
}