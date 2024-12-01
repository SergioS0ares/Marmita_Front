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
          label: "Cadastro",
          routerLink: "auth/register",
          icon: "pi pi-user-plus"
        },
      ]
    } else {
      this.menuItems = [
        {
          label: "Cliente",
          routerLink: "cliente",
          icon: "pi pi-user"
        },
        {
          label: "Entregas", // Nome do componente
          routerLink: "routeMap", // O link para a rota do componente
          icon: "pi pi-map" // Ícone do mapa
        },
        {
          label: "Historico", // Nome do componente
          routerLink: "historico", // O link para a rota do componente
          icon: "pi pi-map" // Ícone do mapa
        }

      ]
    }
  }
}

