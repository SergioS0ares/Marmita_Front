import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteMapService {
  private apiUrl = 'http://localhost:8080/rotas';

  constructor(private http: HttpClient) {}

  // Ajuste no método calcularRotas para aceitar um objeto
  calcularRotas(payload: { capacidadeMarmitas: number; rotas: any[] }): Observable<any> {
    return this.http.post<any>('http://localhost:8080/rotas/calcularRotas', payload);
  }


  // Retorne um tipo mais específico se souber a estrutura exata de "Destino" e "Rotas"
  getDestino(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getDestino`);
  }

  getRotas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getRotas`);
  }
}
