import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ClientService } from '../../services/cliente.service';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'my-app-cliente',
  standalone: true,
  imports: [DialogModule, ButtonModule, TableModule, FormsModule, InputMaskModule, InputTextModule, DropdownModule,AutoCompleteModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent {
  // Dados iniciais
  data = [
    { nome: 'John', telefone: '(62)99915-8956', latitude: '-12.9711100', longitude: '-38.5108300', descricaoEndereco: 'SALVADOR', quantPedido: 5, sujestH: '10:00 - 14:00' },
    {  nome: 'Jane', telefone: '(62)99915-8956', latitude: '-10.1674500', longitude: '-48.3276600', descricaoEndereco: 'PALMAS', quantPedido: 3, sujestH: '11:00 - 12:00'},
    {  nome: 'Mark', telefone: '(62)99915-8956', latitude: '-15.5961100', longitude: '-56.0966700', descricaoEndereco: 'Cuiabá', quantPedido: 8, sujestH: '12:00 - 13:00' }
  ];


  displayDialog = false;
  newItem = { nome: '', telefone: '', latitude: '', longitude: '', descricaoEndereco: '', sujestH: '', quantPedido: 0 }; // Inicializa com o primeiro item da lista de times
  editingItem: any = null;

  constructor(private clienteService: ClientService) {} // Injetando o ClientService

  openDialog() {
    this.newItem = {nome: '', telefone: '', latitude: '', longitude: '', descricaoEndereco: '', sujestH: '', quantPedido: 0 }; // Garantindo que 'sujestH' seja um objeto da lista
    this.displayDialog = true;
    this.editingItem = null;
  }

  filteredTimes: any[] = []; // Inicialize a propriedade para armazenar os horários filtrados

  addItem() {


    // Validação do horário e quantidade
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

    // Console.log para verificar os dados antes de salvar
    console.log('Lista de clientes atualizada:', this.data);

    // Chama o backend para salvar todos os clientes
    this.saveAllClients();

    this.displayDialog = false;
  }



  editItem(item: any) {
    this.newItem = { ...item };
    this.newItem.sujestH = { ...item.sujestH };
    this.editingItem = item;
    this.displayDialog = true;
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
