import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export const RoleGuard  = (route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) => {

    const authService = inject(AuthService);
    const router = inject(Router);
    
    const requireRole = route.data['requireRole'] as Array<string>;
    const role = authService.getRole()[0].authority


    if (authService.isLoggedIn() && requireRole.includes(role)) {
      return true;
    } else {
        router.navigate(['/access-denied'])
        return false;
    }

}
