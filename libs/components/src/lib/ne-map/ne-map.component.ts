import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  effect,
  inject,
  input
} from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LatLng, Map, icon, latLng, marker, tileLayer } from 'leaflet';

const DEFAULT_LAT = 0;
const DEFAULT_LNG = 0;

@Component({
  selector: 'ne-map',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  templateUrl: './ne-map.component.html',
  styleUrl: './ne-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeMapComponent {
  @Output() handelCoordinate = new EventEmitter<LatLng>();
  coordinate = input<{ lat; lng }>({ lat: 0, lng: 0 });
  popMsg = input<string>('');
  isEdit = input(true);
  animation = input<boolean>(true);
  map;
  markerLayer;
  #cd = inject(ChangeDetectorRef);

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
      if (this.map) {
        this.onMapResize();
        this.map.flyTo([this.coordinate().lat, this.coordinate().lng], 3, {
          animate: true,
          duration: 1
        });
        this.updateMarker({
          lat: this.coordinate().lat,
          lng: this.coordinate().lng,
          msg: this.popMsg() !== '' ? this.popMsg() : `lat:${this.coordinate().lat}, lng:${this.coordinate().lng}`
        });
      }
    });
  }

  updateMarker({ lat, lng, msg }: { lat: number; lng: number; msg?: string }) {
    if (this.markerLayer) {
      this.markerLayer.remove();
      this.markerLayer = marker([lat, lng], this.markerIcon).addTo(this.map).bindPopup(msg);
    }
  }

  onMapResize() {
    this.map?.invalidateSize(true);
  }

  initMap() {
    if (this.animation) {
      this.map.flyTo([this.coordinate()?.lat ?? 0, this.coordinate()?.lng ?? 0], 6, {
        animate: true,
        duration: 1.5
      });
    }
    this.map.setMinZoom(1);
    this.map.setMaxZoom(18);
    this.markerLayer = marker([this.coordinate().lat, this.coordinate().lng], this.markerIcon)
      .addTo(this.map)
      .bindPopup(this.popMsg ?? `${this.coordinate().lat},${this.coordinate().lng}`);
  }

  onMapReady(map: Map) {
    this.map = map;
    this.initMap();
    this.onMapResize();
    map.on('click', (event: LatLng) => {
      this.handelCoordinate.emit(event.latlng);
      this.updateMarker({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        msg: this.popMsg() !== '' ? this.popMsg() : `lat:${this.coordinate().lat}, lng:${this.coordinate().lng}`
      });
    });
  }
}
