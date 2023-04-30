import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const AuthGuard  = () => {

    const authService = inject(AuthService);
    const router = inject(Router);
    const toastr = inject(ToastrService);

    if (authService.isLoggedIn()) {
      return true;
    } else {
        toastr.info("Bạn cần đăng nhập để thực hiện chức năng này")
        return router.parseUrl('/login')
    }


    
}
