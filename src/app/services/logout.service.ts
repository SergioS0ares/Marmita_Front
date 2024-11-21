import {inject, Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {MenuService} from "./menu.service";
import {Router} from "@angular/router";
import {RouterService} from "./router.service";

@Injectable({
  providedIn: "root"
})
export class LogoutService {
  authService = inject(AuthService)
  menuService = inject(MenuService)
  router = inject(Router)
  routerService = inject(RouterService)

  logout() {
    this.authService.currentUser.set(null);
    localStorage.removeItem("token")
    this.menuService.setMenu();
    this.routerService.previousUrl.set(this.router.url)
    this.router.navigate(["/auth/login"]).then();
  }
}

