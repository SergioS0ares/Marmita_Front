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
  destinos: any[] = [];
  routeControls: L.Routing.Control[] = [];
  markerClients: L.Marker[] = [];
  markerDestinos: L.Marker[] = [];
  markerArray: L.Marker[] = [];  // Array para armazenar todos os marcadores
  markerRestaurante: L.Marker | null = null; // Se houver um único marcador para o restaurante


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
    this.updateRoutes(this.clients, this.destinos).then(rotasCompletas => {
        const rotasData = rotasCompletas.map((rota) => ({
            id: rota.id || null,
            nome: rota.nome,
            latitude: rota.latitude,
            longitude: rota.longitude,
            quantidadeMarmitas: this.destinos.length > 0 ? rota.quantidadeMarmitas : rota.quantPedido,
            sujestH: rota.sujestH,
            capacidadeMarmitas: rota.capacidadeMarmitas || 12,
            distanciaViagem: rota.distanciaViagem,
            tempoViagem: rota.tempoViagem,
        }));

        console.log('Enviando os dados para calcular as rotas:', rotasData);

        if (rotasCompletas.length === 1) {
            console.log('Somente uma rota encontrada, carregando histórico de rotas.');
            this.loadRotas();
        } else {
            // Chamada POST para calcular rotas
            this.routeMapService.calcularRotas(rotasData).subscribe(
                (response) => {
                    console.log('Resposta recebida ao calcular rotas:', response);
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Rotas calculadas com sucesso!' });
                    this.loadDestinos();
                },
                (error) => {
                    console.error('Erro ao calcular rotas:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Falha ao calcular rotas! ${error.message}` });
                }
            );
        }
    });
}



  loadDestinos() {
    console.log('Iniciando requisição GET para carregar destinos...');
    this.routeMapService.getDestino().subscribe(
      (destinos) => {
        console.log('Destinos recebidos do BACKEND:', destinos);
        this.destinos = destinos;
        this.calcularRotas();
      },
      (error) => {
        console.error('Erro ao carregar destinos:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar destinos!' });
      }
    );
  }


  clearRoutes() {

    console.log('Iniciando a limpeza das rotas e marcadores.');

    // Remover controles de rota
    this.routeControls.forEach((control, index) => {
      console.log(`Removendo controle de rota ${index + 1}:`, control);
      control.remove();  // Remover o controle do mapa
    });
    this.routeControls = []; // Limpar a lista de controles de rota
    console.log('Lista de controles de rota limpa:', this.routeControls);

    // Remover todos os marcadores armazenados em markerArray
    this.markerArray.forEach((marker, index) => {
      console.log(`Removendo marcador ${index + 1}:`, marker);
      this.map?.removeLayer(marker);  // Remover o marcador do mapa
    });
    this.markerArray = []; // Limpar a lista de marcadores
    console.log('Lista de marcadores limpa:', this.markerArray);

    // Remover o marcador do restaurante, se existir
    if (this.markerRestaurante) {
      console.log('Removendo marcador do restaurante:', this.markerRestaurante);
      this.map?.removeLayer(this.markerRestaurante);
      this.markerRestaurante = null;
    } else {
      console.log('Nenhum marcador de restaurante para remover.');
    }

    console.log('Limpeza de rotas e marcadores concluída.');
  }

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

  initMap() {
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;
    this.map = L.map('map').setView([lat, lon], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
  }

  updateRoutes(clients: any[], destinos: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
        let rotasProcessadas = 0;
        const rotasCompletas: any[] = [];
        let inicioLat: number;
        let inicioLon: number;

        // Verifica se é a primeira rodada ou não
        const isPrimeiraRodada = !destinos || destinos.length === 0;

        let listaDeClientes = isPrimeiraRodada ? clients : destinos;
        if (isPrimeiraRodada) {
            inicioLat = parseFloat(this.latitude) || 0;
            inicioLon = parseFloat(this.longitude) || 0;
            console.log('Primeira rodada - Usando clientes e restaurante como origem');
        } else if (destinos.length > 0) {
            inicioLat = parseFloat(destinos[0].latitude);
            inicioLon = parseFloat(destinos[0].longitude);
            console.log('Rodada subsequente - Usando destinos e primeiro destino como origem');
        } else {
            console.error('A lista de destinos está vazia ou inválida');
            reject('A lista de destinos está vazia ou inválida');
            return;
        }

        // Processa cada cliente ou destino
        listaDeClientes.forEach((client) => {
            const waypoint = L.latLng(parseFloat(client.latitude), parseFloat(client.longitude));

            const newRoutingControl = L.Routing.control({
                waypoints: [L.latLng(inicioLat, inicioLon), waypoint],
                routeWhileDragging: false,
                show: false,
                autoRoute: true
            }).addTo(this.map!);

            newRoutingControl.on('routesfound', (event) => {
                const route = event.routes[0];
                client.distanciaViagem = route.summary.totalDistance / 1000; // em km
                client.tempoViagem = route.summary.totalTime / 60; // em minutos

                console.log(`Rota encontrada para ${client.nome}`);
                console.log('Distância (km):', client.distanciaViagem);
                console.log('Tempo (min):', client.tempoViagem);

                rotasCompletas.push(client);
                rotasProcessadas++;

                if (rotasProcessadas === listaDeClientes.length) {
                    console.log('Todas as rotas foram processadas:', rotasCompletas);
                    resolve(rotasCompletas);
                }
            });

            newRoutingControl.on('routingerror', (error) => {
                console.error(`Erro ao calcular a rota para ${client.nome}:`, error);
                reject(error);
            });

            newRoutingControl.route();
        });
    });
}


  loadClients() {
    this.clientService.getClients().subscribe(
      (clients) => {
        this.clients = clients;
        if (this.clients.length > 0) {
          this.updateRoutes(this.clients, this.destinos);
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
      const marker = L.marker([lat, lon]).addTo(this.map!).bindPopup(client.nome);
      this.markerArray.push(marker); // Adiciona ao array de marcadores
    });
  }


  updateMap() {
    const lat = parseFloat(this.latitude) || 0;
    const lon = parseFloat(this.longitude) || 0;
    this.map?.setView([lat, lon], 6);
    this.loadClients();
  }

  loadRotas() {
    this.routeMapService.getRotas().subscribe(
      (rotas) => {
        console.log('Histórico de rotas:', rotas);
      },
      (error) => console.error('Erro ao carregar histórico de rotas:', error)
    );
  }
}
