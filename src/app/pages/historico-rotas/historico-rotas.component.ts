import { Component } from '@angular/core';
import {ClientService} from "../../services/cliente.service";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputMaskModule} from "primeng/inputmask";
import {InputTextModule} from "primeng/inputtext";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {RouteMapService} from "../../services/routeMap.service";

@Component({
  selector: 'my-app-historico-rotas',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    InputMaskModule,
    InputTextModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule
  ],
  templateUrl: './historico-rotas.component.html',
  styles: ``
})
export class HistoricoRotasComponent {
  rotas: any[] = []; // Lista de clientes

  constructor(private routeMapService: RouteMapService) {}

  ngOnInit() {
    this.loadRotas();
  }

  loadRotas() {
    this.routeMapService.getRotas().subscribe(
      (data) => this.rotas = data,
      (error) => console.error('Erro ao carregar rotas:', error)
    );
  }
}

