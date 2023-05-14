import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Image } from '../model/image';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { 

  }

  addImageForPost(postId: number, formData: FormData): Observable<Image[]> {
    return this.http.post<Image[]>(`${this.apiUrl}/image/post/${postId}`, formData);
  }

  addImages(postId: number, formData: FormData): Observable<Image[]> {
    return this.http.post<Image[]>(`${this.apiUrl}/image/post/${postId}/multiple`, formData);
  }

  getImagesByPostId(postId: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/image/post/${postId}`);
  }

  deleteAllImage(postId: number) {
    return this.http.delete(`${this.apiUrl}/image/post/${postId}`);
  }
 
  áda() {
    
  }
}
