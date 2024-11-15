// Importações necessárias de módulos do Angular
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-login', // Seletor do componente
  templateUrl: './login.component.html', // Template HTML do componente
  styleUrls: ['./login.component.css'], // Estilos CSS do componente
})
export class LoginComponent implements OnInit {
  // Construtor com injeção de dependências
  constructor(
    private userService: UserService, // Serviço de usuário
    private userAuthService: UserAuthService, // Serviço de autenticação de usuário
    private router: Router // Serviço de roteamento do Angular
  ) {}

  // Método do ciclo de vida do Angular chamado quando o componente é inicializado
  ngOnInit(): void {}

  // Método para login de usuário
  login(loginForm: NgForm) {
    // Chama o serviço de login do usuário com os valores do formulário
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        // Define os papéis do usuário usando o serviço de autenticação
        this.userAuthService.setRoles(response.user.role);
        // Define o token JWT usando o serviço de autenticação
        this.userAuthService.setToken(response.jwtToken);

        // Obtém o papel do usuário
        const role = response.user.role[0].roleName;
        // Redireciona o usuário com base no papel
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      (error) => {
        // Loga qualquer erro que ocorra durante o login
        console.log(error);
      }
    );
  }

  // Método para redirecionar o usuário para a página de registro
  registerUser() {
    this.router.navigate(['/register']);
  }
}
