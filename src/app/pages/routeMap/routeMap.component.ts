import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/cliente.service';
import { RestauranteService } from '../../services/restaurante.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast'; // Importação do módulo Toast

@Component({
  selector: 'my-app-routeMap',
  standalone: true,
  templateUrl: './routeMap.component.html',
  styleUrls: ['./routeMap.component.scss'],
  imports: [FormsModule, ButtonModule, ToastModule],
  providers: [MessageService],
})
export class RouteMap implements OnInit {
  latitude: string = '';
  longitude: string = '';
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  routingControl: L.Routing.Control | null = null;
  clients: any[] = [];

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private restauranteService: RestauranteService,
    private router: Router
  ) {}

  salvarCoordenadas() {
    this.restauranteService.updateCoordenadas(this.latitude, this.longitude).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Restaurante salvo com sucesso!' });
        this.router.navigate(['/outra-rota']); // Navegue para outra rota
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar o restaurante!' });
        console.error(error);
      }
    );
  }


  ngOnInit() {
    this.initMap();
    this.loadCoordenadas(); // Carrega coordenadas do restaurante
    this.loadClients();
  }

  loadCoordenadas() {
    this.restauranteService.getCoordenadas().subscribe(
      (data) => {
        if (data) {
          this.latitude = data.latitudeRestaurante;
          this.longitude = data.longitudeRestaurante;
          this.updateMap(); // Atualiza o mapa ao carregar as coordenadas
        }
      },
      (error) => console.error('Erro ao carregar coordenadas:', error)
    );
  }



  initMap() {
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;
    this.map = L.map('map').setView([lat, lon], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
  }

  updateRoutes(clients: any[]) {
    if (this.routingControl) {
      this.map?.removeControl(this.routingControl);
    }

    clients.forEach((client) => {
      const waypoint = L.latLng(parseFloat(client.latitude), parseFloat(client.longitude));
      const newRoutingControl = L.Routing.control({
        waypoints: [
          L.latLng(parseFloat(this.latitude), parseFloat(this.longitude)),
          waypoint
        ],
        routeWhileDragging: true,
        show: true
      }).addTo(this.map!);
    });
  }

  loadClients() {
    this.clientService.getClients().subscribe(
      (clients) => {
        if (clients.length >= 1) {
          this.updateRoutes(clients);
          this.addMarkers(clients);
        }
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  addMarkers(clients: any[]) {
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
    this.map?.setView([lat, lon], 6);
    this.loadClients();
  }
}
