import { Component, Injectable, OnInit } from '@angular/core';
import { Client, Stomp, StompConfig } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { ChatMessage } from 'src/app/model/chatMessage';
import { User } from 'src/app/model/user';
import { ChatService } from 'src/app/services/chat.service';

@Injectable()
export class CategoryService {

}

@Component({
  selector: 'app-test-not',
  templateUrl: './test-not.component.html',
  styleUrls: ['./test-not.component.css']
})
export class TestNotComponent implements OnInit{
  stompClient = new Client()
  messageObservable!: Observable<any>;
  messages: string[] = [];
  receivers: User[] = []

  constructor(private chatService: ChatService){
    // const stompClient = new Client({
    //   brokerURL: 'ws://localhost:8080/ws',
    //   onConnect: () => {
    //     stompClient.subscribe('/user/docco@hackmail.com/topic/messages', message =>
    //       console.log(`Received: ${message.body}`)
    //     );
    //     // stompClient.publish({ destination: '/topic/test01', body: 'First Message' });
    //     // stompClient.publish({destination: '/app/chat', body: '3'})
    //   },
    //   debug: (msg: string) => {
    //     console.log(msg);
    //   },
    // });
    
    // stompClient.activate();

    const stompConfig: StompConfig = {
      brokerURL: 'ws://localhost:8080/ws',
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000,
    };

    this.stompClient = new Client(stompConfig);
    this.stompClient.activate();

    this.messageObservable = new Observable(observer => {
      this.stompClient.onConnect = () => {
        this.stompClient.subscribe('/user/docco@hackmail.com/topic/messages', message => {
          observer.next(message.body);
        });
      };
    });

    this.stompClient.debug = (msg: string) => {
      console.log(msg)
    }

    this.messageObservable.subscribe(message => {
      this.messages.push(message)
      console.log(message)
    })
    
    // this.sendMessage('kaka', 'dongphuong@dp.com', 9)
  }
  ngOnInit(): void {
    this.chatService.getAllReceiver().subscribe({
      next: data => {
        this.receivers = data
        console.log(this.receivers)
      }
    })
  }


  sendMessage(message: string, emailReceiver: string, receiverId: number){
    const chatMessage = {
      messageContent: message,
      receiver: {
        id: receiverId,
        email: emailReceiver
      }
      
    }
    // chatMessage.messageContent = message;
    // chatMessage.receiver.id = receiverId;
    // chatMessage.receiver.email = emailReceiver;
    
    this.chatService.sendMessage(chatMessage).subscribe()
  }
}
