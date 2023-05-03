import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { defaultAvatar } from 'src/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  user?: User;
  avatar: any = defaultAvatar;
  totalQuantityFavorite: number = 0;

  constructor(private authService: AuthService,
    private _sanitizer: DomSanitizer,
    private favoritesService: FavoritesService) {

  }

  ngOnInit(): void {
    this.updateProfileHeader()
    this.updateTotalFavoritePost()
    
  }

  updateTotalFavoritePost() {
    this.favoritesService.totalQuantity.subscribe(data => this.totalQuantityFavorite = data)
  }

  updateProfileHeader() {
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

  showDropdown = false;
  toggleDropdown() {
    this.showDropdown = !this.showDropdown
  }

}
