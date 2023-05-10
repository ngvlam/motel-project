import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Client } from '@stomp/stompjs';
import { NotificationName } from 'src/app/model/NotificationName';
import { Notification } from 'src/app/model/notification';
import { Page } from 'src/app/model/page';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { NotificationService } from 'src/app/services/notification.service';
import { defaultAvatar } from 'src/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('dropdown', { read: ElementRef }) dropdown!: ElementRef;
  @ViewChild('dropdownNotif', { read: ElementRef }) dropdownNotif!: ElementRef;

  user?: User;
  avatar: any = defaultAvatar;

  notiName = NotificationName;

  totalQuantityFavorite: number = 0;
  totalQuantityNotif: number = 0;
  totalQuantityNotifUnseen: number = 0;

  notifications: Notification[] = []
  page: Page<any> = new Page<any>();

  constructor(private authService: AuthService,
    private _sanitizer: DomSanitizer,
    private favoritesService: FavoritesService,
    private notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.updateProfileHeader()
    this.updateTotalFavoritePost()
    this.getNotification()
    this.connectSocketNotification()
  }

  updateTotalFavoritePost() {
    this.favoritesService.totalQuantity.subscribe(data => this.totalQuantityFavorite = data)
  }

  updateProfileHeader() {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({
        next: data => {
          this.user = data

          if (this.user.b64 != null && this.user.b64 != '')
            this.avatar = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + this.user.b64);
          else
            this.avatar = defaultAvatar;
        },

        error: error => {
          console.log(error)
        }

      })
    }
  }

  getNotification() {
    this.notificationService.getNotification(0, 4).subscribe({
      next: data => {
        this.page = data
        this.notifications = this.page.content
        this.getTotalUnseenNotification()
        this.totalQuantityNotif = this.page.totalElements
      }
    })
  }

  connectSocketNotification() {
    const email = this.authService.getUserEmail();
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        stompClient.subscribe(`/user/${email}/queue/notifications`, message => {
          this.notifications.unshift(JSON.parse(message.body))
          this.totalQuantityNotifUnseen++
        }
          // console.log(message.body)      
        );
      }
    });
    stompClient.activate();
  }

  getTotalUnseenNotification() {
    this.notificationService.getNotificationBySeen(1, 'false', 4).subscribe({
      next: data => {
        this.totalQuantityNotifUnseen = data.totalElements
      }
    })
  }

  seen(notif: Notification) {
    if (!notif.seen) {
      this.notificationService.seenNotification(notif.id).subscribe({
        next: data => {
          this.getNotification();
        },
        error: error => {
          console.log(error.error.message);
        }
      });
    }
  }

  showDropdown = false;
  showDropdownNotif = false;
  toggleDropdown() {
    this.showDropdown = !this.showDropdown
  }

  toggleDropdownNotif() {
    this.showDropdownNotif = !this.showDropdownNotif

  }

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!this.dropdown?.nativeElement.contains(target)) {
      this.showDropdown = false;
    }

    if (!this.dropdownNotif?.nativeElement.contains(target)) {
      this.showDropdownNotif = false;
    }
  }
}
