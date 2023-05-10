import { Component, OnInit } from '@angular/core';
import { NotificationName } from 'src/app/model/NotificationName';
import { Notification } from 'src/app/model/notification';
import { Page } from 'src/app/model/page';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.css']
})
export class NotificationManagementComponent implements OnInit{
  seenSelect: string = ''
  notiName = NotificationName;
  notifications: Notification[] = []
  page: Page<any> = new Page<any>()

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.getNotification(1)
  }

  getNotification(pageNumber: number) {
    if (this.seenSelect == '') {
      this.notificationService.getNotification(pageNumber-1, 8).subscribe({
        next: data => {
          this.page = data
          this.notifications = this.page.content
        }
      })
    }
    else {
      this.notificationService.getNotificationBySeen(pageNumber - 1, this.seenSelect, 8).subscribe({
        next: data => {
          this.page = data
          this.notifications = this.page.content
        }
      })
    }
  }

  filterNotification() {
    this.getNotification(1)
  }

  seen(notif: Notification) {
    if (!notif.seen) {
      this.notificationService.seenNotification(notif.id).subscribe({
        next: data => {
          this.getNotification(this.page.number + 1);
        },
        error: error => {
          console.log(error.error.message);
        }
      });
    }
  }
}
