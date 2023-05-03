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
        return router.parseUrl('/login')
    }

}
