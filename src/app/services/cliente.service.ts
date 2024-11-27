import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Cliente} from "../models/cliente.interface";

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private baseUrl = 'http://localhost:8080/cliente';

  private clients = [
    { id: 1, name: 'John', phone: '(62)99915-8956', latitude: '-12.9711100', longitude: '-38.5108300', addressDescription: 'SALVADOR' },
    { id: 2, name: 'Jane', phone: '(62)99915-8956', latitude: '-10.1674500', longitude: '-48.3276600', addressDescription: 'PALMAS' },
    { id: 3, name: 'Mark', phone: '(62)99915-8956', latitude: '-15.5961100', longitude: '-56.0966700', addressDescription: 'Cuiabá' }
  ];

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  salvarCliente(cliente: any): Observable<any> {


    return this.http.post<Cliente>(this.baseUrl, cliente);
  }
}
