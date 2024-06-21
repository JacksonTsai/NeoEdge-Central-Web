import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TCategoryCoordinate } from '@neo-edge-web/models';
import { Map, icon, latLng, marker, tileLayer } from 'leaflet';

const DEFAULT_LAT = 0;
const DEFAULT_LNG = 0;

@Component({
  selector: 'ne-map-multiple-mark',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  templateUrl: './ne-map-multiple-mark.component.html',
  styleUrl: './ne-map-multiple-mark.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeMapMultipleMarkComponent {
  width = input<string>('435px');
  height = input<string>('150px');
  coordinateList = input<TCategoryCoordinate[]>([]);
  animation = input<boolean>(true);
  map = signal(null);
  markerLayer = [];

  markerIcon = {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      popupAnchor: [2, -40],
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  };

  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  options = {
    layers: [this.streetMaps],
    zoom: 1,
    center: latLng([DEFAULT_LAT, DEFAULT_LNG])
  };

  constructor() {
    effect(() => {
      if (this.map && this.coordinateList().length) {
        this.onMapResize();
        this.flyToFirstMark();

        if (this.markerLayer.length) {
          this.clearMarker();
        }
        this.coordinateList().forEach((item) => {
          this.addMarker(item);
        });
      }
    });
  }

  addMarker({ lat, lng, msg }: { lat: number; lng: number; msg?: string }) {
    const markerItem = marker([lat, lng], this.markerIcon).addTo(this.map()).bindPopup(msg);
    this.markerLayer.push(markerItem);
  }

  clearMarker(): void {
    this.markerLayer.forEach((item) => item.remove());
    this.markerLayer = [];
  }

  flyToFirstMark() {
    if (this.coordinateList().length) {
      const firstCoordinate = this.coordinateList()[0];
      this.map().flyTo([firstCoordinate?.lat ?? 0, firstCoordinate?.lng ?? 0], 3, {
        animate: true,
        duration: 1.5
      });
    }
  }

  onMapResize() {
    this.map()?.invalidateSize(true);
  }

  initMap() {
    if (this.animation) {
      this.flyToFirstMark();
    }
    this.map().setMinZoom(1);
    this.map().setMaxZoom(18);
  }

  onMapReady(map: Map) {
    this.map.set(map);
    this.initMap();
    this.onMapResize();
  }
}
