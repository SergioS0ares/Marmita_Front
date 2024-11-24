import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private clients = [
    { id: 1, name: 'John', phone: '(62)99915-8956', latitude: '-12.9711100', longitude: '-38.5108300', addressDescription: 'SALVADOR' },
    { id: 2, name: 'Jane', phone: '(62)99915-8956', latitude: '-10.1674500', longitude: '-48.3276600', addressDescription: 'PALMAS' },
    { id: 3, name: 'Mark', phone: '(62)99915-8956', latitude: '-15.5961100', longitude: '-56.0966700', addressDescription: 'Cuiabá' }
  ];

  getClients() {
    return this.clients;
  }

  addClient(client: any) {
    this.clients.push(client);
  }
}
