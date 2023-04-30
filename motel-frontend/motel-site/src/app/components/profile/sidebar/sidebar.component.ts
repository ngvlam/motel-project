import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { defaultAvatar } from 'src/config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  user?: User;
  avatar: any = defaultAvatar;

  constructor(private authService: AuthService,
    private _sanitizer: DomSanitizer,) {

  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
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

  
}
