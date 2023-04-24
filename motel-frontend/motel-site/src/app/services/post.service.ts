import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Page } from '../model/page';
import { Post } from '../model/post';
import { Observable } from 'rxjs';
import { SearchForm } from '../model/searchForm';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = '/api';
  private searchUrl?: string;

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

  createPost(post: Post) : Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts?auth=tieuphong@ex.com`, post);
  }

  searchPost(searchForm: SearchForm, page: number, sort: string): Observable<Page<Post>> {
  
    let params = new HttpParams();

// Loop through the object and add each key-value pair to the HttpParams object
    for (const key in searchForm) {
      if (searchForm.hasOwnProperty(key)) {
        params = params.set(key, searchForm[key]);
      }
    }
    
    return this.http.get<Page<Post>>(this.apiUrl + '/posts/search?' + '&page=' + page + '&sort=' + sort, {params});
  }

}
