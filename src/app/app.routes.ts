import { Routes } from '@angular/router';
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "auth/login",
    loadComponent: () => import("./pages/login/login.component").then(mod => mod.LoginComponent),
  },
  {
    path: "auth/register",
    loadComponent: () => import("./pages/register/register.component").then(mod => mod.RegisterComponent),
  },
  {
    path: "cliente",
    loadComponent: () => import("./pages/cliente/cliente.component").then(mod => mod.ClienteComponent),
    canActivate: [authGuard]
  },
  {
    path: "",
    loadComponent: () => import("./pages/cliente/cliente.component").then(mod => mod.ClienteComponent),
    canActivate: [authGuard]
  },
  {
    path: "routeMap",
    loadComponent: () => import("./pages/routeMap/routeMap.component").then(mod => mod.RouteMap),
    canActivate: [authGuard]
  },
  {
    path: "historico",
    loadComponent: () => import("./pages/historico-rotas/historico-rotas.component").then(mod => mod.HistoricoRotasComponent),
    canActivate: [authGuard]
  }
];
