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
  latitude: string = ''; // Tipo string para capturar coordenadas do input
  longitude: string = ''; // Tipo string para capturar coordenadas do input
  map: any;
  marker: L.Marker | null = null; // Variável para armazenar o marcador atual
  routingControl: L.Routing.Control | null = null; // Variável para armazenar o controle de rota atual

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    // Inicializa o mapa com as coordenadas iniciais (caso não tenha valores)
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;

    this.map = L.map('map').setView([lat, lon], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.updateRoutes();
  }

  updateMap() {
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;

    if (this.map) {
      this.map.setView([lat, lon], 6);
      this.updateRoutes();
    }

    // Atualiza o marcador
    this.updateMarker(lat, lon);
  }

  updateRoutes() {
    // Remove o controle de rota anterior, se houver
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    // Define a rota com base nas coordenadas inseridas
    this.routingControl = L.Routing.control({
      waypoints: [
        L.latLng(parseFloat(this.latitude), parseFloat(this.longitude)), // Converte para number
        L.latLng(-10.1674500, -48.3276600) // Destino
      ],
      routeWhileDragging: true,
      show: false // Não mostra o painel
    }).addTo(this.map);
  }

  updateMarker(lat: number, lon: number) {
    // Se já houver um marcador, remove ele antes de adicionar um novo
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Cria um novo marcador com as coordenadas fornecidas
    this.marker = L.marker([lat, lon]).addTo(this.map);
  }
}
