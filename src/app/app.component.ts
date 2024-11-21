import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationComponent} from "./pages/navigation/navigation.component";
import {MenuService} from "./services/menu.service";
import {LogoutService} from "./services/logout.service";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "./services/login.service";
import {UserInterface} from "./models/user.interface";
import {environment} from "../environments/environment";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'my-app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  menuService = inject(MenuService);
  loginService = inject(LoginService);
  logoutService = inject(LogoutService);
  http = inject(HttpClient)

  ngOnInit(): void {
    console.log("Check called")
    this.initialLogin();
    this.menuService.setMenu()
  }

  private initialLogin() {
    if (!localStorage.getItem("token"))
      return;
    this.http.get<UserInterface>(environment.apiUrl + "/refresh-token")
      .subscribe({
        next: (user) => {
          this.loginService.login(user);
        },
        error: () => {
          this.logoutService.logout();
        }
      })
  }
}
