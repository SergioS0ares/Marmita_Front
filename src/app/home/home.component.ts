// Importações necessárias de módulos do Angular, operadores RxJS e serviços personalizados
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ImageProcessingService } from '../image-processing.service';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-home', // Seletor do componente
  templateUrl: './home.component.html', // Template HTML do componente
  styleUrls: ['./home.component.css'] // Estilos CSS do componente
})
export class HomeComponent implements OnInit {

  // Inicializa a variável pageNumber para controlar a paginação
  pageNumber: number = 0;

  // Array para armazenar os detalhes dos produtos
  productDetails = [];

  // Booleano para controlar a exibição do botão de carregar mais
  showLoadButton = false;

  // Injeção de dependências no construtor
  constructor(
    private productService: ProductService, // Serviço de produtos
    private imageProcessingService: ImageProcessingService, // Serviço de processamento de imagens
    private router: Router // Serviço de roteamento do Angular
  ) { }

  // Método chamado quando o componente é inicializado
  ngOnInit(): void {
    this.getAllProducts(); // Obtém todos os produtos ao inicializar o componente
  }

  // Método para buscar produtos por palavra-chave
  searchByKeyword(searchkeyword) {
    console.log(searchkeyword); // Loga a palavra-chave no console
    this.pageNumber = 0; // Reseta o número da página
    this.productDetails = []; // Limpa os detalhes dos produtos
    this.getAllProducts(searchkeyword); // Obtém produtos com a palavra-chave
  }

  // Método para obter todos os produtos
  public getAllProducts(searchKey: string = "") {
    this.productService.getAllProducts(this.pageNumber, searchKey)
      .pipe(
        // Processa as imagens dos produtos usando o ImageProcessingService
        map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
      )
      .subscribe(
        (resp: Product[]) => {
          console.log(resp); // Loga a resposta no console
          if (resp.length == 12) {
            this.showLoadButton = true; // Exibe o botão de carregar mais se houver 12 produtos na resposta
          } else {
            this.showLoadButton = false; // Oculta o botão de carregar mais se houver menos de 12 produtos
          }
          resp.forEach(p => this.productDetails.push(p)); // Adiciona os produtos obtidos ao array de detalhes dos produtos
        },
        (error: HttpErrorResponse) => {
          console.log(error); // Loga o erro no console
        }
      );
  }

  // Método para carregar mais produtos
  public loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1; // Incrementa o número da página
    this.getAllProducts(); // Obtém mais produtos
  }

  // Método para exibir os detalhes de um produto
  showProductDetails(productId) {
    this.router.navigate(['/productViewDetails', { productId: productId }]); // Navega para a página de detalhes do produto com o ID do produto
  }
}
