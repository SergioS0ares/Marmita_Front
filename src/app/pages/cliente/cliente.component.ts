import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClientService } from '../../services/cliente.service';

@Component({
  selector: 'my-app-cliente',
  standalone: true,
  imports: [DialogModule, ButtonModule, TableModule, FormsModule, InputMaskModule, InputTextModule, DropdownModule, AutoCompleteModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  data: any[] = []; // Array para armazenar os clientes
  displayDialog = false;
  newItem = { nome: '', telefone: '', latitude: '', longitude: '', descricaoEndereco: '', sujestH: '', quantPedido: 0 };
  editingItem: any = null;

  filteredTimes: any[] = []; // Inicialize a propriedade para armazenar os horários filtrados

  constructor(private clienteService: ClientService) {} // Injetando o ClientService

  ngOnInit() {
    this.loadClients(); // Carrega os clientes ao iniciar a tela
  }

  openDialog() {
    this.newItem = { nome: '', telefone: '', latitude: '', longitude: '', descricaoEndereco: '', sujestH: '', quantPedido: 0 };
    this.displayDialog = true;
    this.editingItem = null;
  }

  addItem() {
    if (this.newItem.quantPedido < 0) {
      alert('A quantidade de marmitas não pode ser negativa');
      return;
    }

    if (this.editingItem) {
      // Atualiza item existente
      Object.assign(this.editingItem, this.newItem);
    } else {
      // Adiciona novo item
      this.data.push({ ...this.newItem });
    }

    console.log('Lista de clientes atualizada:', this.data);
    this.saveAllClients(); // Salva todos os clientes
    this.displayDialog = false;
  }

  editItem(item: any) {
    this.newItem = { ...item };
    this.editingItem = item;
    this.displayDialog = true;
  }

  // Função para buscar todos os clientes do backend
  loadClients() {
    this.clienteService.getClients().subscribe(
      (clients) => {
        this.data = clients;
        console.log('Clientes carregados com sucesso:', this.data);
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  // Função para salvar todos os clientes no backend
  saveAllClients() {
    this.clienteService.saveAllClients(this.data).subscribe(
      (response) => {
        console.log('Todos os clientes salvos com sucesso!', response);
      },
      (error) => {
        console.error('Erro ao salvar clientes:', error);
      }
    );
  }
}
