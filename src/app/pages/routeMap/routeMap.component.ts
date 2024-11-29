import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/cliente.service'; // Importando o serviço para acessar os destinos

@Component({
  selector: 'my-app-routeMap',
  standalone: true,
  templateUrl: './routeMap.component.html',
  styleUrls: ['./routeMap.component.scss'],
  imports: [FormsModule],
})
export class RouteMap implements OnInit {
  latitude: string = ''; // Ponto de origem (latitude do usuário)
  longitude: string = ''; // Ponto de origem (longitude do usuário)
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  routingControl: L.Routing.Control | null = null;
  clients: any[] = []; // Armazena os destinos do banco de dados

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.initMap();
    this.loadClients(); // Carrega os destinos ao inicializar o mapa
  }

  initMap() {
    // Ponto de origem do usuário
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;

    // Inicializa o mapa com as coordenadas de origem
    this.map = L.map('map').setView([lat, lon], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
  }

  updateRoutes(clients: any[]) {
    // Remove os controles de rota antigos
    if (this.routingControl) {
      this.map?.removeControl(this.routingControl);
    }

    // Para cada cliente, cria uma rota da origem para o destino
    clients.forEach((client) => {
      const waypoint = L.latLng(parseFloat(client.latitude), parseFloat(client.longitude));

      // Cria a rota da origem para o destino
      const newRoutingControl = L.Routing.control({
        waypoints: [
          L.latLng(parseFloat(this.latitude), parseFloat(this.longitude)), // Ponto de origem
          waypoint // Destino
        ],
        routeWhileDragging: true,
        show: false // Não mostra o painel
      }).addTo(this.map!);
    });
  }

  loadClients() {
    this.clientService.getClients().subscribe(
      (clients) => {
        if (clients.length >= 1) {
          // Passa os clientes para o método de atualização das rotas
          this.updateRoutes(clients);
          this.addMarkers(clients); // Adiciona os marcadores para todos os clientes
        }
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  addMarkers(clients: any[]) {
    // Adiciona marcadores para os destinos
    clients.forEach((client) => {
      const lat = parseFloat(client.latitude);
      const lon = parseFloat(client.longitude);
      L.marker([lat, lon]).addTo(this.map!).bindPopup(client.nome);
      console.log(`Marcador adicionado: ${client.nome} [${lat}, ${lon}]`);
    });
  }

  updateMap() {
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;
    this.map?.setView([lat, lon], 6); // Atualiza o centro do mapa

    // Atualiza a rota e os marcadores
    this.loadClients();
  }
}
