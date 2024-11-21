import {inject, Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {MenuItem} from "primeng/api";

@Injectable({
  providedIn: "root"
})
export class MenuService {
  public menuItems: MenuItem[] = [];
  private authService = inject(AuthService)

  setMenu() {
    if (!this.authService.currentUser()) {
      this.menuItems = [
        {
          label: "Login",
          routerLink: "auth/login",
          icon: "pi pi-sign-in"
        },
        {
          label: "Register",
          routerLink: "auth/register",
          icon: "pi pi-user-plus"
        },
      ]
    } else {
      this.menuItems = [
        {
          label: "Dashboard",
          routerLink: "",
          icon: "pi pi-home"
        },
        {
          label: "Profile",
          routerLink: "profile",
          icon: "pi pi-user"
        }
      ]
    }
  }
}

