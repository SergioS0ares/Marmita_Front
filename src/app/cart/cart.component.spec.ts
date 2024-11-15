// Importações necessárias para os testes do Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';

// Descrição do conjunto de testes para o componente CartComponent
describe('CartComponent', () => {
  let component: CartComponent; // Declaração da variável para a instância do componente
  let fixture: ComponentFixture<CartComponent>; // Declaração da variável para o fixture do componente

  // Bloco de configuração antes de cada teste
  beforeEach(async () => {
    // Configuração do módulo de teste com o componente a ser testado
    await TestBed.configureTestingModule({
      declarations: [ CartComponent ] // Declara o componente que será testado
    })
    .compileComponents(); // Compila os componentes declarados
  });

  // Bloco de inicialização antes de cada teste
  beforeEach(() => {
    // Cria uma instância do fixture para o componente
    fixture = TestBed.createComponent(CartComponent);
    // Obtém a instância do componente a partir do fixture
    component = fixture.componentInstance;
    // Detecta mudanças e atualiza a visualização do componente
    fixture.detectChanges();
  });

  // Teste simples para verificar se o componente foi criado corretamente
  it('should create', () => {
    // Verifica se a instância do componente é verdadeira (existe)
    expect(component).toBeTruthy();
  });
});
