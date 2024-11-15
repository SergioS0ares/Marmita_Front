// Importações necessárias de vários módulos do Angular e serviços personalizados
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { FileHandle } from "../_model/file-handle.model";
import { Product } from "../_model/product.model";
import { ProductService } from "../_services/product.service";

@Component({
  selector: "app-add-new-product", // Seletor do componente
  templateUrl: "./add-new-product.component.html", // Template HTML do componente
  styleUrls: ["./add-new-product.component.css"], // Estilos CSS do componente
})
export class AddNewProductComponent implements OnInit {
  isNewProduct = true; // Flag para verificar se o produto é novo

  // Objeto de produto inicializado com valores padrão
  product: Product = {
    productId: null,
    productName: "",
    productDescription: "",
    productDiscountedPrice: 0,
    productActualPrice: 0,
    productImages: [],
  };

  // Injeção de dependências no construtor
  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) {}

  // Método chamado quando o componente é inicializado
  ngOnInit(): void {
    // Obtém o produto dos dados resolvidos na rota, se disponível
    this.product = this.activatedRoute.snapshot.data['product'];

    // Se o produto tiver um ID, define isNewProduct como false
    if (this.product && this.product.productId) {
      this.isNewProduct = false;
    }
  }

  // Método para adicionar um novo produto
  addProduct(productForm: NgForm) {
    const formData = this.prepareFormDataForProduct(this.product);
    this.productService.addProduct(formData).subscribe(
      (response: Product) => {
        // Reseta o formulário e limpa as imagens do produto
        productForm.reset();
        this.product.productImages = [];
      },
      (error: HttpErrorResponse) => {
        console.log(error); // Loga o erro no console
      }
    );
  }

  // Prepara os dados do formulário para envio do produto
  prepareFormDataForProduct(product: Product): FormData {
    const uploadImageData = new FormData();
    uploadImageData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    // Adiciona as imagens do produto ao FormData
    for (var i = 0; i < this.product.productImages.length; i++) {
      uploadImageData.append(
        "imageFile",
        this.product.productImages[i].file,
        this.product.productImages[i].file.name
      );
    }
    return uploadImageData;
  }

  // Método chamado quando um arquivo é selecionado pelo usuário
  onFileSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        ),
      };
      this.product.productImages.push(fileHandle); // Adiciona a imagem ao array de imagens do produto
    }
  }

  // Método para remover uma imagem do array de imagens do produto
  removeImages(i: number) {
    this.product.productImages.splice(i, 1);
  }

  // Método chamado quando um arquivo é solto na área de drop
  fileDropped(fileHandle: FileHandle) {
    this.product.productImages.push(fileHandle);
  }
}
