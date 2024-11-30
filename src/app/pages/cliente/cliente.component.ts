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
import { ConfirmationService } from 'primeng/api';  // Importação para o serviço de confirmação
import { ConfirmDialogModule } from 'primeng/confirmdialog';  // Módulo de diálogo de confirmação

@Component({
  selector: 'my-app-cliente',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    TableModule,
    FormsModule,
    InputMaskModule,
    InputTextModule,
    DropdownModule,
    AutoCompleteModule,
    ConfirmDialogModule  // Adiciona o módulo de confirmação
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  providers: [ConfirmationService]  // Fornece o serviço de confirmação
})
export class ClienteComponent implements OnInit {
  data: any[] = [];
  displayDialog = false;
  newItem = { nome: '', telefone: '', latitude: '', longitude: '', descricaoEndereco: '', sujestH: '', quantPedido: 0 };
  editingItem: any = null;
  editDialog: boolean = false; // Controle do modal de edição
  selectedItem: any = {};

  constructor(private clienteService: ClientService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.loadClients();
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
      Object.assign(this.editingItem, this.newItem);
    } else {
      this.data.push({ ...this.newItem });
    }

    this.saveAllClients();
    this.displayDialog = false;
  }

  editItem(item: any) {
    this.selectedItem = { ...item }; // Cria uma cópia do item selecionado
    this.editDialog = true; // Abre o modal de edição
  }

  saveItem() {
    console.log('Enviando para o backend:', this.selectedItem);
    this.clienteService.updateClient(this.selectedItem.id, this.selectedItem).subscribe({
      next: (response) => {
        console.log('Resposta do backend:', response);
        const index = this.data.findIndex((i) => i.id === this.selectedItem.id);
        if (index !== -1) {
          this.data[index] = response; // Atualiza o item no array com os dados do backend
        }
        this.editDialog = false; // Fecha o modal
        console.log('Item atualizado no backend:', response);
      },
      error: (err) => {
        console.error('Erro ao atualizar o item no backend:', err.message);
      }
    });
  }

  cancelEdit() {
    this.editDialog = false; // Fecha o modal sem salvar
  }


  loadClients() {
    this.clienteService.getClients().subscribe(
      (clients) => {
        this.data = clients;
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja excluir este cliente?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteClient(id);
      },
      reject: () => {
        console.log('Exclusão cancelada.');
      }
    });
  }

  deleteClient(id: string) {
    this.clienteService.deleteClient(id).subscribe(
      () => {
        this.loadClients();
      },
      (error) => {
        console.error('Erro ao deletar cliente:', error);
        this.loadClients();
      }
    );
  }

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
