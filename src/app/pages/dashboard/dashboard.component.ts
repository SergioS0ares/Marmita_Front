import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'my-app-dashboard',
  standalone: true,
  imports: [DialogModule, ButtonModule, TableModule, FormsModule, InputMaskModule, InputTextModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  data = [
    { id: 1, name: 'John', phone: '(62)99915-8956', latitude: '40.7128', longitude: '-74.0060', addressDescription: 'New York, NY' },
    { id: 2, name: 'Jane', phone: '(62)99915-8956', latitude: '34.0522', longitude: '-118.2437', addressDescription: 'Los Angeles, CA' },
    { id: 3, name: 'Mark', phone: '(62)99915-8956', latitude: '41.8781', longitude: '-87.6298', addressDescription: 'Chicago, IL' }
  ];
  displayDialog = false;
  newItem = { id: 0, name: '', phone: '', latitude: '', longitude: '', addressDescription: '' };
  editingItem: any = null; // Variável para armazenar o item que está sendo editado

  openDialog() {
    this.newItem = { id: this.data.length + 1, name: '', phone: '', latitude: '', longitude: '', addressDescription: '' };
    this.displayDialog = true;
    this.editingItem = null; // Limpa a variável quando abrir o formulário para um novo item
  }

  addItem() {
    if (this.editingItem) {
      // Se estamos editando um item existente, atualize os dados na tabela
      this.editingItem.name = this.newItem.name;
      this.editingItem.phone = this.newItem.phone;
      this.editingItem.latitude = this.newItem.latitude;
      this.editingItem.longitude = this.newItem.longitude;
      this.editingItem.addressDescription = this.newItem.addressDescription;
    } else {
      // Se não estamos editando, adicione um novo item
      this.data.push({ ...this.newItem });
    }
    this.displayDialog = false;
  }

  editItem(item: any) {
    // Preenche o formulário com os dados do item a ser editado
    this.newItem = { ...item }; // Copia os dados do item
    this.editingItem = item; // Armazena o item para referência durante a edição
    this.displayDialog = true; // Exibe o diálogo
  }

  deleteItem(id: number) {
    this.data = this.data.filter(item => item.id !== id);
  }
}
