import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../model/page';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiServerUrl = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) {
  }

  getAllApproverAccounts(page: number, pageSize: number, sort:string, accountType: string[]): Observable<Page<User>> {
    return this.http.get<Page<User>>(`${this.apiServerUrl}/api/users?page=${page}&roles=${accountType.join(',')}`
    + `&page=${page}&size=${pageSize}&sort=${sort}`);
  }

  getAllApproverSearchAccounts(page: number, pageSize: number, query:string, sort:string, accountType: string[]): Observable<Page<User>> {
    return this.http.get<Page<User>>(`${this.apiServerUrl}/api/users?page=${page}&roles=${accountType.join(',')}`
    + `&page=${page}&size=${pageSize}&sort=${sort}&query=${query}`);
  }

  getAccountById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/api/users/${id}`);
  }

  updateProfile(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/api/users/${id}`, user);
  }

  blockAccount(id: number): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/api/users/${id}/block`, null);
  }

  unBlockAccount(id: number): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/api/users/${id}/unblock`, null);
  }

  changePassword(id: number, newPassword: string): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/api/users/${id}/password`, null,
      {
        params: {
          password: newPassword,
        }
      });
  }

  checkExistEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiServerUrl}/api/users/check?email=${email}`);
  }

  registerAccount(account: any) {
    return this.http.post<any>(`${this.apiServerUrl}/api/users`, account);
  }

  getAvatar(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/api/users/${id}/avatar`);
  }

  uploadAvatar(id: number, avatar: any) {
    return this.http.post(`${this.apiServerUrl}/api/users/${id}/avatar`, avatar);
  }

  removeAvatar(id: number) {
    return this.http.delete(`${this.apiServerUrl}/api/users/${id}/avatar`);
  }

  updateRole(id: number, role: string) {
    return this.http.put(`${this.apiServerUrl}/api/users/${id}/role`, [role]);
  }
}
