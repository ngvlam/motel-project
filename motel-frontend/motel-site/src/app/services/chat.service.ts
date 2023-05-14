import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "@stomp/stompjs";
import { AuthService } from "./auth.service";
import { Notification } from "../model/notification";
import { Page } from "../model/page";
import { ChatMessage } from "../model/chatMessage";
import { User } from "../model/user";

@Injectable({
    providedIn: 'root'
})

export class ChatService { 

    private apiUrl = '/api';

    // notification: Notification = new Notification()

    constructor(private http: HttpClient, private authService: AuthService) {
        
    }

    sendMessage(chatMessage: any) : Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/messages`, chatMessage)
    }

    getAllReceiver() : Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/messages/users`)
    }
}