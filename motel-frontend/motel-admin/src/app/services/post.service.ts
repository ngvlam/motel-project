import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Page } from '../model/page';
import { Post } from '../model/post';
import { environment } from 'src/environments/environment';
import { Action } from '../model/action';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = '/api';
  
  constructor(private http: HttpClient) { }

  getActionsByUserId(page: number, id: number): Observable<Page<Action>> {
    return this.http.get<Page<Action>>(`${this.apiUrl}/actions/user/${id}?page=${page}`);
  }

  getPostsWithApprove(page: number, approved: boolean): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${this.apiUrl}/posts/approved/${approved}?page=${page}&sort=updatedAt,desc`
                                    );
  }

  getWaitingPosts = (page: number): Observable<Page<Post>> => {
    return this.http.get<Page<Post>>(`${this.apiUrl}/posts/waiting?page=${page}&sort=priority,desc&sort=updatedAt,asc`);
  };

  getBlockedPosts = (page: number): Observable<Page<Post>> => {
    return this.getPostsWithApprove(page, false);
  };

  getApprovedPosts = (page: number): Observable<Page<Post>> => {
    return this.getPostsWithApprove(page, true);
  };


  getAllPosts = (page: number): Observable<Page<Post>> => {
    return this.http.get<Page<Post>>(`${this.apiUrl}/posts?page=${page}`);
  };

  getPostOfUser(userId: number, page: number): Observable<Page<Post>>{
    return this.http.get<Page<Post>>(`${this.apiUrl}/posts/user/${userId}?page=${page}`);
  }

  getPostByCategory(categoryId: string, page: number) :Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${this.apiUrl}/posts/search?categoryId=${categoryId}&page=${page}`);

  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }


  blockPostById(id: number) : Observable<Post>{
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}/approve/false`, null);
  }

  approvePostById(id: number) : Observable<Post>{
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}/approve/true`, null);
  }
}

