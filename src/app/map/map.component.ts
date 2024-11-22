import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'my-app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styles: ``
})
export class MapComponent {

  mapa: any;

  private initMap(): void {
    this.mapa = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
