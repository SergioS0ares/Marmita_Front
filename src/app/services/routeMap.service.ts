import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteMapService {
  private apiUrl = 'http://localhost:8080/rotas';

  constructor(private http: HttpClient) {}

  // Defina o tipo como any[] ou outro tipo específico, dependendo da estrutura esperada
  calcularRotas(rotas: any[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/calcularRotas`, rotas);
  }

  // Retorne um tipo mais específico se souber a estrutura exata de "Destino" e "Rotas"
  getDestino(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getDestino`);
  }

  getRotas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getRotas`);
  }
}
