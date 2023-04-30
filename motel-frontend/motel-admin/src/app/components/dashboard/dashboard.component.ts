import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit{

  totalPost: number = 0;
  totalApprovedPost: number = 0;
  totalUser: number = 0;
  constructor(private postService: PostService,
              private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getTotalPost()
    this.getTotalApprovedPost();
    this.getTotalUser()
  }
  
  getTotalPost() {
    this.postService.getAllPosts(1)
    .subscribe({
      next: data => this.totalPost = data.totalElements
    })
  }

  getTotalApprovedPost() {
    this.postService.getApprovedPosts(1)
    .subscribe({
      next: data => this.totalApprovedPost = data.totalElements
    })
  }

  getTotalUser() {
    let roles: string[] = []
    roles.push('ROLE_USER')
    roles.push('ROLE_MODERATOR')
    roles.push('ROLE_ADMIN')
    this.userService.getAllApproverAccounts(0, 5, '', roles).subscribe({
      next: data => this.totalUser = data.totalElements
    })
  }

  getTotalApprovedPostToday() {
    
  }
}
