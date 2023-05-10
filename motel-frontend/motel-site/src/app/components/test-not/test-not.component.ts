import { Component, Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';

@Injectable()
export class CategoryService {

}

@Component({
  selector: 'app-test-not',
  templateUrl: './test-not.component.html',
  styleUrls: ['./test-not.component.css']
})
export class TestNotComponent {
  notifications: any[] = [];

  constructor() {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        stompClient.subscribe('/user/docco@hackmail.com/topic/messages', message =>
          console.log(`Received: ${message.body}`)
        );
        // stompClient.publish({ destination: '/topic/test01', body: 'First Message' });
        // stompClient.publish({destination: '/app/chat', body: '3'})
      },
      debug: (msg: string) => {
        console.log(msg);
      },
    });
    
    stompClient.activate();

  }
}
