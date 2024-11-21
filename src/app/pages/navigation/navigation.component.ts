import {Component, inject} from '@angular/core';
import {MenubarModule} from "primeng/menubar";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {MenuService} from "../../services/menu.service";
import {LogoutService} from "../../services/logout.service";

@Component({
  selector: 'my-app-navigation',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule,
    NgIf
  ],
  templateUrl: './navigation.component.html',
  styles: ``
})
export class NavigationComponent {
  authService = inject(AuthService)
  menuService = inject(MenuService)
  logoutService = inject(LogoutService)

  logout() {
    this.logoutService.logout();
  }
}
