import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Page } from '../model/page';
import { Post } from '../model/post';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { 

  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(this.apiUrl + '/posts/' + id);
  }

  getPostByUser(userId: number, page: number) {
    return this.http.get<Page<Post>>(this.apiUrl + '/posts/user/' + userId + '?page=' + page);
  }

  getAllPostApproved(page: number, sort: string): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${this.apiUrl}/posts/approved/true?page=${page}&sort=priority,desc&sort=${sort}`);
  }
}
