import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    // Get the auth token from the auth service
    const authToken = this.cookieService.get('access_token');
    
    if(!this.needsAuthorization(req)) {
      return next.handle(req)
    } 

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    return next.handle(authReq)
  }

  private needsAuthorization(request: HttpRequest<any>): boolean {
    return request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE';
  }
}
