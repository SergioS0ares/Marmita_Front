import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/cliente.service';
import { RestauranteService } from '../../services/restaurante.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { RouteMapService } from '../../services/routeMap.service';
import { HttpClient } from '@angular/common/http';

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
    private routeMapService: RouteMapService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.initMap();
    this.loadCoordenadas();
    this.loadClients();
  }

  // Método para salvar as coordenadas do restaurante
  salvarCoordenadas() {
    this.restauranteService.updateCoordenadas(this.latitude, this.longitude).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Restaurante salvo com sucesso!' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Falha ao salvar o restaurante! ${error.message}` });
        console.error(error);
      }
    );
  }

  calcularRotas() {
    // Primeiro, chamar o updateRoutes para calcular distância e tempo
    this.updateRoutes(this.clients).then(rotasCompletas => {
      console.log('Rotas com distância e tempo calculados:', rotasCompletas);

      // Depois de calcular, criar a lista com os dados finais
      const rotasData = rotasCompletas.map(client => ({
        nome: client.nome,
        latitude: client.latitude,
        longitude: client.longitude,
        quantidadeMarmitas: client.quantPedido,
        sujestH: client.sujestH,
        capacidadeMarmitas: 12,
        distanciaViagem: client.distanciaViagem, // Já calculado
        tempoViagem: client.tempoViagem          // Já calculado
      }));

      console.log('Lista final de rotas para enviar ao backend:', rotasData);

      // Log do POST
      console.log('Enviando POST com as rotas para o backend');

      // Enviar a lista para o backend
      this.routeMapService.calcularRotas(rotasData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Rotas calculadas com sucesso!' });
          this.loadDestinos(); // Carrega os destinos retornados pelo backend
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Falha ao calcular rotas! ${error.message}` });
          console.error('Erro ao calcular rotas:', error);
        }
      );
    });
  }

  // Método para carregar os destinos calculados
  loadDestinos() {
    // Log do GET
    console.log('Enviando GET para carregar os destinos do backend');

    this.routeMapService.getDestino().subscribe(
      (destinos) => {
        console.log('Destinos obtidos do backend:', destinos);
        this.updateRoutes(destinos); // Atualiza o mapa com os destinos retornados
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar destinos!' });
        console.error('Erro ao carregar destinos:', error);
      }
    );
  }



  // Carregar as coordenadas do restaurante
  loadCoordenadas() {
    this.restauranteService.getCoordenadas().subscribe(
      (data) => {
        if (data) {
          this.latitude = data.latitudeRestaurante;
          this.longitude = data.longitudeRestaurante;
          this.updateMap();
        }
      },
      (error) => console.error('Erro ao carregar coordenadas:', error)
    );
  }

  // Inicializar o mapa com coordenadas padrão
  initMap() {
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;
    this.map = L.map('map').setView([lat, lon], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
  }

  // Atualizar o mapa com as novas rotas
  updateRoutes(clients: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let rotasProcessadas = 0;
      const rotasCompletas: any[] = [];

      clients.forEach((client, index) => {
        const waypoint = L.latLng(parseFloat(client.latitude), parseFloat(client.longitude));
        const newRoutingControl = L.Routing.control({
          waypoints: [L.latLng(parseFloat(this.latitude), parseFloat(this.longitude)), waypoint],
          routeWhileDragging: false,
          show: false,
          autoRoute: true // Garante que o cálculo inicie imediatamente
        }).addTo(this.map!); // Força a entrada no mapa imediatamente

        console.log(`Tentando calcular rota para: ${client.nome} (Index: ${index})`);

        newRoutingControl.on('routesfound', (event) => {
          const route = event.routes[0];
          client.distanciaViagem = route.summary.totalDistance / 1000; // km
          client.tempoViagem = route.summary.totalTime / 60; // minutos

          console.log(`Rota encontrada para: ${client.nome}`);
          console.log('Distância (km):', client.distanciaViagem);
          console.log('Tempo (min):', client.tempoViagem);

          rotasCompletas.push(client);
          rotasProcessadas++;

          if (rotasProcessadas === clients.length) {
            console.log('Todas as rotas foram processadas:', rotasCompletas);
            resolve(rotasCompletas);
          }
        });

        newRoutingControl.on('routingerror', (error) => {
          console.error(`Erro ao calcular a rota para ${client.nome}:`, error);
          reject(error);
        });

        // Força manualmente o cálculo da rota, caso o evento automático não funcione
        newRoutingControl.route();
      });
    });
  }

  // Carregar os clientes
  loadClients() {
    this.clientService.getClients().subscribe(
      (clients) => {
        if (clients.length >= 1) {
          this.updateRoutes(clients);
          this.addMarkers(clients);
          this.clients = clients;
        }
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  // Adicionar marcadores no mapa para cada cliente
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


  // Carregar o histórico de rotas
  loadRotas() {
    this.routeMapService.getRotas().subscribe(
      (rotas) => {
        console.log('Histórico de rotas:', rotas);
      },
      (error) => {
        console.error('Erro ao carregar o histórico de rotas:', error);
      }
    );
  }
}
