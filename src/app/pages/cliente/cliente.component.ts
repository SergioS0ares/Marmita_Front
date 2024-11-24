import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'my-app-cliente',
  standalone: true,
  imports: [DialogModule, ButtonModule, TableModule, FormsModule, InputMaskModule, InputTextModule, DropdownModule],

  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent {
  // Dados iniciais
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
      this.data.push({ ...this.newItem });
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
}

