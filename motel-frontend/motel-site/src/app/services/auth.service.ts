import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Account } from '../model/account';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
private apiUrl = '/api';
  private accessToken: string = '';
  private jwtHelper = new JwtHelperService();
  private readonly COOKIE_OPTIONS = { sameSite: 'strict', secure: true };


  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

  login(email: string, password: string, rememberMe:boolean): Observable<any> {

    return this.http.post(`${this.apiUrl}/auth/signin`, { email, password })
      .pipe(
        tap((response:any) => {
          const expirationDate = rememberMe ? new Date(new Date().getTime() + 604800000) : undefined; // 7 days
          this.cookieService.set('access_token', response.accessToken, expirationDate);
        })
      );
  }

  logout() {
    this.cookieService.delete('access_token');
  }

  // isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   return token && !this.jwtHelper.isTokenExpired(token);
  // }

  isLoggedIn() {
    return this.cookieService.check('access_token');
  }

  getCurrentUser(): Observable<User> {
    // // Get the current user from the server using the authentication token or session
    // if (this.isAuthenticated) {
    //   return this.http.get(`${this.apiUrl}/users/current`, { headers: { Authorization: `Bearer ${this.accessToken}` } });
    // } else {
    //   return null;
    // }
    const userId = this.getUserId()

    return this.http.get<User> (`${this.apiUrl}/users/${userId}`);
  }

  getUserId() {
    const jwtToken = this.cookieService.get('access_token');
    const decodedToken = this.jwtHelper.decodeToken(jwtToken);
    const userId = decodedToken?.id || '';
    return userId;
  }

  signup(account: Account) : Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/signup`, account)
  }

  // getUserInfo(): any {
  //   const token = this.getToken();
  //   const decodedToken = this.jwtHelper.decodeToken(token);
  //   return decodedToken;
  // }

  // isRemembered(): boolean {
  //   // Check if the user has requested to be remembered
  //   return localStorage.getItem('rememberMe') === 'true';
  // }

  // getToken(): any {
  //   const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  //   return token;
  // }

  // getAuthToken(): string {
  //   if (this.accessToken) {
  //     return this.accessToken;
  //   } else if (localStorage.getItem('accessToken')) {
  //     this.accessToken = localStorage.getItem('accessToken')!;
  //     return this.accessToken;
  //   } else {
  //     return '';
  //   }
  // }
}
