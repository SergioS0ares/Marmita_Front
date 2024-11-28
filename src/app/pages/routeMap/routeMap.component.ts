import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/cliente.service'; // Importe seu serviço de clientes

@Component({
  selector: 'my-app-routeMap',
  standalone: true,
  templateUrl: './routeMap.component.html',
  styleUrls: ['./routeMap.component.scss'],
  imports: [FormsModule],
})
export class RouteMap implements OnInit {
  latitude: string = '';
  longitude: string = '';
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  routingControl: L.Routing.Control | null = null;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    console.log('Inicializando o mapa...');
    this.initMap();
    console.log('Carregando clientes...');
    this.loadClients();
  }

  initMap() {
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;
    console.log(`Inicializando mapa com coordenadas: [${lat}, ${lon}]`);

    this.map = L.map('map').setView([lat, lon], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  loadClients() {
    this.clientService.getClients().subscribe(
      (clients) => {
        console.log('Clientes recebidos do backend:', clients);

        const waypoints = clients.map((client) => {
          console.log(`Processando cliente: ${client.nome}, Coordenadas: [${client.latitude}, ${client.longitude}]`);
          return L.latLng(parseFloat(client.latitude), parseFloat(client.longitude));
        });

        // Adiciona o ponto de início fornecido pelo usuário
        if (this.latitude && this.longitude) {
          const userLatLng = L.latLng(parseFloat(this.latitude), parseFloat(this.longitude));
          console.log('Adicionando ponto inicial fornecido pelo usuário:', userLatLng);
          waypoints.unshift(userLatLng); // Garante que o ponto inicial do usuário seja o primeiro
        }

        console.log('Waypoints finais:', waypoints);
        this.updateRoutes(waypoints);
        this.addMarkers(clients);
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  updateRoutes(waypoints: L.LatLng[]) {
    console.log('Atualizando rotas com os seguintes waypoints:', waypoints);

    if (this.routingControl) {
      console.log('Removendo controle de rota anterior.');
      this.map?.removeControl(this.routingControl);
    }

    this.routingControl = L.Routing.control({
      waypoints, // Usa o array de waypoints dinamicamente
      routeWhileDragging: true,
      show: false, // Oculta o painel de informações, se necessário
      fitSelectedRoutes: true, // Ajusta o zoom para caber todas as rotas
    }).addTo(this.map!);

    // Log para confirmar que a rota foi adicionada
    console.log('Rota atualizada com sucesso.');
  }


  addMarkers(clients: any[]) {
    console.log('Adicionando marcadores para os clientes...');

    clients.forEach((client) => {
      const lat = parseFloat(client.latitude);
      const lon = parseFloat(client.longitude);
      console.log(`Adicionando marcador para ${client.nome} em [${lat}, ${lon}]`);
      L.marker([lat, lon]).addTo(this.map!).bindPopup(client.nome);
    });

    // Adiciona o marcador do ponto de início do usuário
    if (this.latitude && this.longitude) {
      const userLat = parseFloat(this.latitude);
      const userLon = parseFloat(this.longitude);
      console.log(`Adicionando marcador para o ponto inicial do usuário em [${userLat}, ${userLon}]`);
      this.marker = L.marker([userLat, userLon]).addTo(this.map!).bindPopup('Ponto de Início');
    }
  }

  updateMap() {
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;
    console.log(`Atualizando visualização do mapa para [${lat}, ${lon}]`);
    this.map?.setView([lat, lon], 6);
  }
}
