import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from '../model/page';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  getAllPosts = (page: number): Observable<Page<Post>> => {
    return this.httpClient.get<Page<Post>>(`${this.apiServerUrl}/api/posts?page=${page}`);
  };
}
