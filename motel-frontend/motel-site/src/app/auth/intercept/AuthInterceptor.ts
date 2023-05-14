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
    const url = request.url.toLowerCase();
    const isApiRequest = url.startsWith('/api');
    const isNotification = url.includes('/notifications')
    const isSensitiveMethod = request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE';
    const sensitiveData = ['credit_card'];

    const requestBody = JSON.stringify(request.body);

    // if(request.method === 'POST' && url.includes('auth')) {
    //   return false;
    // }

    if(request.method === 'POST' && url.includes('report-posts')) {
      return false;
    }

    if(request.method === 'GET' && url.includes('payments')) {
      return true;
    }

    if(request.method === 'GET' && url.includes('messages')) {
      return true;
    }

    // if(url.includes("ws")) {
    //   return true;
    // }

    const hasSensitiveData = sensitiveData.some(data => requestBody.includes(data));
    return isApiRequest && (isSensitiveMethod || hasSensitiveData || isNotification);
  }
}
