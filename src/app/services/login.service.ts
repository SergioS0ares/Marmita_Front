import {inject, Injectable} from "@angular/core";
import {UserInterface} from "../models/user.interface";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {MenuService} from "./menu.service";
import {MessageHelperService} from "./message-helper.service";
import {RouterService} from "./router.service";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  authService = inject(AuthService)
  router = inject(Router)
  menuService = inject(MenuService)
  messageHelperService = inject(MessageHelperService)
  routerService = inject(RouterService)

  login(user: UserInterface) {
    console.log(user)
    localStorage.setItem("token", user.token)
    this.authService.currentUser.set(user);
    let nextUrl = this.routerService.previousUrl() ?? "/";
    this.router.navigateByUrl(nextUrl).then();
    this.menuService.setMenu()
    this.messageHelperService.sendSuccessMessage("Logged in successfully!", "")
  }
}

