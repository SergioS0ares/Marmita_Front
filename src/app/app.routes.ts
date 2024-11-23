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
    path: "dashboard",
    loadComponent: () => import("./pages/dashboard/dashboard.component").then(mod => mod.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: "",
    loadComponent: () => import("./pages/dashboard/dashboard.component").then(mod => mod.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: "routeMap",
    loadComponent: () => import("./pages/routeMap/routeMap.component").then(mod => mod.RouteMap),
    canActivate: [authGuard]
  }
];
