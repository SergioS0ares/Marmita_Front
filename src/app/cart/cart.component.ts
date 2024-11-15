// Importações necessárias de módulos do Angular e serviços personalizados
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-cart', // Seletor do componente
  templateUrl: './cart.component.html', // Template HTML do componente
  styleUrls: ['./cart.component.css'] // Estilos CSS do componente
})
export class CartComponent implements OnInit {

  // Colunas que serão exibidas na tabela do carrinho
  displayedColumns: string[] = ['Name', 'Description', 'Price', 'Discounted Price', 'Action'];

  // Array para armazenar os detalhes do carrinho
  cartDetails: any[] = [];

  // Injeção de dependências no construtor
  constructor(private productService: ProductService, private router: Router) { }

  // Método chamado quando o componente é inicializado
  ngOnInit(): void {
    this.getCartDetails(); // Obtém os detalhes do carrinho ao inicializar o componente
  }

  // Método para deletar um item do carrinho
  delete(cartId) {
    console.log(cartId); // Loga o ID do carrinho no console
    this.productService.deleteCartItem(cartId).subscribe(
      (resp) => {
        console.log(resp); // Loga a resposta no console
        this.getCartDetails(); // Atualiza os detalhes do carrinho
      },
      (err) => {
        console.log(err); // Loga o erro no console
      }
    );
  }

  // Método para obter os detalhes do carrinho
  getCartDetails() {
    this.productService.getCartDetails().subscribe(
      (response: any[]) => {
        console.log(response); // Loga a resposta no console
        this.cartDetails = response; // Atualiza o array de detalhes do carrinho com a resposta
      },
      (error) => {
        console.log(error); // Loga o erro no console
      }
    );
  }

  // Método para proceder ao checkout
  checkout() {
    this.router.navigate(['/buyProduct', {
      isSingleProductCheckout: false, id: 0
    }]); // Navega para a página de compra com parâmetros

    // Código comentado que poderia ser usado para obter detalhes do produto
    // this.productService.getProductDetails(false, 0).subscribe(
    //   (resp) => {
    //     console.log(resp);
    //   }, (err) => {
    //     console.log(err);
    //   }
    // );
  }
}
