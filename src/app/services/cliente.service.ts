import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/client'; // Substitua pela URL correta do seu backend

  constructor(private http: HttpClient) {}

  // Método para obter todos os clientes
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllclients`);
  }

  // Método para salvar todos os clientes de uma vez
  saveAllClients(clients: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveAllClients`, clients); // O token será adicionado automaticamente pelo interceptor
  }

  // Método para adicionar um cliente
  addClient(client: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveClient`, client); // O token será adicionado automaticamente pelo interceptor
  }

  // Método para deletar um cliente
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteClient/${id}`); // O token será adicionado automaticamente pelo interceptor
  }
}
