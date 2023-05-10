import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  role: string[] = ['ROLE_MODERATOR'];
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({
        next: data => {
          this.role = data.roles
        },

        error: error => {
          console.log(error)
        }

      })
    }
  }

}
