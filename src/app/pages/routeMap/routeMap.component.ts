import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'my-app-routeMap',
  standalone: true,
  templateUrl: './routeMap.component.html',
  styleUrls: ['./routeMap.component.scss']
})
export class RouteMap implements OnInit {
  ngOnInit() {
    const map = L.map('map').setView([16.6869, -49.2648], 6); // Definir o ponto central do mapa (Goiânia)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adicionando marcador personalizado com a cor vermelha e o texto "Restaurante"
    const restaurantMarker = L.marker([16.6869, -49.2648], {
      icon: L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png', // Ícone de marcador vermelho padrão
        iconSize: [25, 41], // Tamanho do ícone
        iconAnchor: [12, 41], // Posição do âncoras do ícone
        popupAnchor: [0, -41] // Posição do popup
      })
    }).addTo(map)
      .bindPopup('Restaurante') // Texto "Restaurante" no popup
      .openPopup();

    // Definindo as rotas
    const route1 = [
      L.latLng(16.6869, -49.2648), // Ponto de origem (Goiânia)
      L.latLng(10.1815, -48.3340)   // Destino (Palmas)
    ];

    const route2 = [
      L.latLng(16.6869, -49.2648), // Ponto de origem (Goiânia)
      L.latLng(23.5505, -46.6333)  // Destino (São Paulo)
    ];

    // Rota Goiânia -> Palmas
    L.Routing.control({
      waypoints: route1,
      routeWhileDragging: true,
      show: false
    }).addTo(map);

    // Rota Goiânia -> São Paulo
    L.Routing.control({
      waypoints: route2,
      routeWhileDragging: true,
      show: false
    }).addTo(map);

    // Atualizando o mapa quando o usuário altera os valores de latitude e longitude
    const latitudeInput = document.getElementById('latitudeInput') as HTMLInputElement;
    const longitudeInput = document.getElementById('longitudeInput') as HTMLInputElement;

    latitudeInput.addEventListener('input', () => {
      const lat = parseFloat(latitudeInput.value);
      const lng = parseFloat(longitudeInput.value);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 13);
        restaurantMarker.setLatLng([lat, lng]);
      }
    });

    longitudeInput.addEventListener('input', () => {
      const lat = parseFloat(latitudeInput.value);
      const lng = parseFloat(longitudeInput.value);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 13);
        restaurantMarker.setLatLng([lat, lng]);
      }
    });
  }
}
