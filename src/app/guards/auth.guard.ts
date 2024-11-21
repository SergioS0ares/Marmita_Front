import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {RouterService} from "../services/router.service";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const routerService = inject(RouterService)
  let currentUser = authService.currentUser();
  if (!currentUser) {
    routerService.previousUrl.set(state.url)
    router.navigate(["/auth/login"]).then();
    return false;
  }
  return true;
};

