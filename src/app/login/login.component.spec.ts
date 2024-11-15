// Importações necessárias de módulos do Angular para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

// Descreve o conjunto de testes para o componente LoginComponent
describe('LoginComponent', () => {
  // Declaração de variáveis para o componente e o fixture
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Bloco executado antes de cada teste
  beforeEach(async () => {
    // Configura o módulo de teste para o componente LoginComponent
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ] // Declara o componente que será testado
    })
    .compileComponents(); // Compila os componentes declarados
  });

  // Bloco executado antes de cada teste individual
  beforeEach(() => {
    // Cria uma instância do fixture para o LoginComponent
    fixture = TestBed.createComponent(LoginComponent);
    // Obtém a instância do componente a partir do fixture
    component = fixture.componentInstance;
    // Detecta mudanças no componente
    fixture.detectChanges();
  });

  // Teste que verifica se o componente foi criado com sucesso
  it('should create', () => {
    // Verifica se a instância do componente é verdadeira (existe)
    expect(component).toBeTruthy();
  });
});
