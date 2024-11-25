import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import {FormsModule, NgForm} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import {Cliente} from "../../models/cliente.interface";
import {ClientService} from "../../services/cliente.service";

@Component({
  selector: 'my-app-cliente',
  standalone: true,
  imports: [DialogModule, ButtonModule, TableModule, FormsModule, InputMaskModule, InputTextModule, DropdownModule],

  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent {
  // Dados iniciais
  cliente = {

    name: '',
    phone: '',
    latitude: '',
    longitude: '',
    addressDescription: '',
    marmitasQuantity: 0,
    suggestedTime: { label: '', value: '' },
  };
  clientes: any[] = [];

  data = [
    { id: 1, name: 'John', phone: '(62)99915-8956', latitude: '-12.9711100', longitude: '-38.5108300', addressDescription: 'SALVADOR', marmitasQuantity: 5, suggestedTime: { label: '10:00 - 14:00', value: '10:00 - 14:00' } },
    { id: 2, name: 'Jane', phone: '(62)99915-8956', latitude: '-10.1674500', longitude: '-48.3276600', addressDescription: 'PALMAS', marmitasQuantity: 3, suggestedTime: { label: '11:00 - 12:00', value: '11:00 - 12:00' } },
    { id: 3, name: 'Mark', phone: '(62)99915-8956', latitude: '-15.5961100', longitude: '-56.0966700', addressDescription: 'Cuiabá', marmitasQuantity: 8, suggestedTime: { label: '12:00 - 13:00', value: '12:00 - 13:00' } }
  ];

  times = [
    { label: '10:00 - 11:00', value: '10:00 - 11:00' },
    { label: '11:00 - 12:00', value: '11:00 - 12:00' },
    { label: '12:00 - 13:00', value: '12:00 - 13:00' },
    { label: '13:00 - 14:00', value: '13:00 - 14:00' },
    { label: '10:00 - 14:00', value: '10:00 - 14:00' }
  ];

  displayDialog = false;
  newItem = { id: 0, name: '', phone: '', latitude: '', longitude: '', addressDescription: '', suggestedTime: this.times[0], marmitasQuantity: 0 }; // Inicializa com o primeiro item da lista de times
  editingItem: any = null;

  constructor(private _clienteService: ClientService) {}

  openDialog() {
    this.newItem = { id: this.data.length + 1, name: '', phone: '', latitude: '', longitude: '', addressDescription: '', suggestedTime: this.times[0], marmitasQuantity: 0 }; // Garantindo que 'suggestedTime' seja um objeto da lista
    this.displayDialog = true;
    this.editingItem = null;
  }

  addItem() {

    if (!this.newItem.suggestedTime || !this.newItem.suggestedTime.value) {
      alert('Por favor, selecione um horário válido.');
      return;
    }
    console.log("Adicionar item: ", this.newItem.suggestedTime);

    // Validação do horário e quantidade
    if (this.newItem.marmitasQuantity < 0) {
      alert('A quantidade de marmitas não pode ser negativa');
      return;
    }

    if (this.editingItem) {
      // Atualiza item existente
      this.editingItem.name = this.newItem.name;
      this.editingItem.phone = this.newItem.phone;
      this.editingItem.latitude = this.newItem.latitude;
      this.editingItem.longitude = this.newItem.longitude;
      this.editingItem.addressDescription = this.newItem.addressDescription;
      this.editingItem.suggestedTime = this.newItem.suggestedTime;
      this.editingItem.marmitasQuantity = this.newItem.marmitasQuantity;
    } else {
      // Adiciona novo item
      const newDataItem = { ...this.newItem };
      this.data.push(newDataItem);
      const newCliente: Cliente = {

        name: newDataItem.name,
        phone: newDataItem.phone,
        latitude: newDataItem.latitude,
        longitude: newDataItem.longitude,
        addressDescription: newDataItem.addressDescription,
        marmitasQuantity: newDataItem.marmitasQuantity,
        suggestedTime: { ...newDataItem.suggestedTime }, // Mantém o formato { label, value }
      };
      this.clientes.push(newCliente);
    }


    // Log para verificar os dados após a adição ou edição
    console.log(this.data);

    this.displayDialog = false;
  }

  editItem(item: any) {
    this.newItem = { ...item };
    this.newItem.suggestedTime = { ...item.suggestedTime };
    this.editingItem = item;
    this.displayDialog = true;
  }

  deleteItem(id: number) {
    this.data = this.data.filter(item => item.id !== id);
  }

  onSubmit(form: NgForm) {
    // Chama o serviço para salvar o cliente
    this._clienteService.salvarCliente(this.cliente).subscribe({
      next: (data) => {
        console.log('Cliente salvo com sucesso:', data);

        // Reseta o formulário
        form.reset();

        // Atualiza a lista de clientes
        this._clienteService.getClientes().subscribe((clientes ) => {
          this.clientes  = clientes ; // Atualiza a tabela de clientes
        });
      },
      error: (error) => {
        console.error('Erro ao salvar o cliente:', error);
        alert('Ocorreu um erro ao salvar o cliente.');
      },
    });
  }

}

