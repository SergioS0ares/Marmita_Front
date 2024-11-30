import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestauranteService {
  private apiUrl = 'http://localhost:8080/pontoInicial'; // Substitua pela URL correta

  constructor(private http: HttpClient) {}

  // Método para obter as coordenadas do restaurante
  getCoordenadas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/coordenadas`);
  }

  // Método para salvar ou atualizar as coordenadas do restaurante
  updateCoordenadas(latitude: string, longitude: string): Observable<any> {
    const body = { latitudeRestaurante: latitude, longitudeRestaurante: longitude };
    return this.http.post<any>(`${this.apiUrl}/coordenadas`, body);
  }
}
