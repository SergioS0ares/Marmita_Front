import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule

@Component({
  selector: 'my-app-routeMap',
  standalone: true,
  templateUrl: './routeMap.component.html',
  styleUrls: ['./routeMap.component.scss'],
  imports: [FormsModule] // Adicione FormsModule aos imports
})
export class RouteMap implements OnInit {
  latitude: number = 0; // Inicializa com 0 ou qualquer valor vazio
  longitude: number = 0; // Inicializa com 0 ou qualquer valor vazio
  map: any; // Variável para armazenar o mapa

  ngOnInit() {
    this.initMap(); // Inicializa o mapa ao carregar
  }

  initMap() {
    // Cria o mapa com as coordenadas iniciais (0,0)
    this.map = L.map('map').setView([this.latitude, this.longitude], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.updateRoutes(); // Adiciona as rotas iniciais
  }

  updateMap() {
    // Atualiza o mapa com as novas coordenadas inseridas pelo usuário
    if (this.map) {
      this.map.setView([this.latitude, this.longitude], 6); // Atualiza a posição central do mapa
      this.updateRoutes(); // Atualiza as rotas
    }
  }

  updateRoutes() {
    // Rota com base nas coordenadas inseridas pelo usuário
    const route1 = [
      L.latLng(this.latitude, this.longitude), // Ponto de origem
      L.latLng(-10.1674500, -48.3276600)   // Destino
    ];

    const route2 = [
      L.latLng(this.latitude, this.longitude), // Ponto de origem
      L.latLng(-23.5475000, -46.6361100)  // Destino
    ];

    // Remove as rotas anteriores
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Routing.Control) {
        this.map.removeLayer(layer);
      }
    });

    // Controle da rota Goiânia -> Palmas
    L.Routing.control({
      waypoints: route1,
      routeWhileDragging: true,
      show: false
    }).addTo(this.map);

    // Controle da rota Goiânia -> São Paulo
    L.Routing.control({
      waypoints: route2,
      routeWhileDragging: true,
      show: false
    }).addTo(this.map);
  }
}
