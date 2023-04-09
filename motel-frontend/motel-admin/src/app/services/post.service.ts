import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Page } from '../model/page';
import { Post } from '../model/post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiServerUrl = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) { }

  getPostsWithApprove(page: number, approved: boolean): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${this.apiServerUrl}/api/posts/approved/${approved}?page=${page}`);
  }

  getWaitingPosts = (page: number): Observable<Page<Post>> => {
    return this.http.get<Page<Post>>(`${this.apiServerUrl}/api/posts/waiting?page=${page}`);
  };

  getBlockedPosts = (page: number): Observable<Page<Post>> => {
    return this.getPostsWithApprove(page, false);
  };

  getApprovedPosts = (page: number): Observable<Page<Post>> => {
    return this.getPostsWithApprove(page, true);
  };



  getAllPosts = (page: number): Observable<Page<Post>> => {
    return this.http.get<Page<Post>>(`${this.apiServerUrl}/api/posts?page=${page}`);
  };

  getPostOfUser(userId: number, page: number): Observable<Page<Post>>{
    return this.http.get<Page<Post>>(`${this.apiServerUrl}/api/post/user/${userId}?page=${page}`);
  }
}
