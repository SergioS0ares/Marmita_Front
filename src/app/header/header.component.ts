// Importações necessárias de módulos do Angular e serviços personalizados
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-header', // Seletor do componente
  templateUrl: './header.component.html', // Template HTML do componente
  styleUrls: ['./header.component.css'], // Estilos CSS do componente
})
export class HeaderComponent implements OnInit {
  
  // Injeção de dependências no construtor
  constructor(
    private userAuthService: UserAuthService, // Serviço de autenticação de usuário
    private router: Router, // Serviço de roteamento do Angular
    public userService: UserService // Serviço de usuário
  ) {}

  // Método chamado quando o componente é inicializado
  ngOnInit(): void {}

  // Método para verificar se o usuário está logado
  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  // Método para fazer logout do usuário
  public logout() {
    this.userAuthService.clear(); // Limpa os dados de autenticação do usuário
    this.router.navigate(['/']); // Navega para a página inicial
  }

  // Método para verificar se o usuário é um administrador
  public isAdmin() {
    return this.userAuthService.isAdmin();
  }

  // Método para verificar se o usuário é um usuário comum
  public isUser() {
    return this.userAuthService.isUser();
  }
}
