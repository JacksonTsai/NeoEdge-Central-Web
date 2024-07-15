import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, effect, inject, input, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ICategoryCoordinate } from '@neo-edge-web/models';
import { Map, Util, divIcon, latLng, marker, tileLayer } from 'leaflet';
interface IMarkerSvgIconSettings {
  mapIconUrl: string;
  mapIconColor: string;
}

interface IGetMarkerIcon {
  icon: any;
}

const LEAFLET_POPUP_ROUTERLINK_CLASSNAME = 'leaflet-popup-routerlink';

@Component({
  selector: 'ne-map-multiple-mark',
  standalone: true,
  imports: [CommonModule, LeafletModule, RouterModule],
  templateUrl: './ne-map-multiple-mark.component.html',
  styleUrl: './ne-map-multiple-mark.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeMapMultipleMarkComponent {
  #router = inject(Router);
  width = input<string>('435px');
  height = input<string>('150px');
  coordinateList = input<ICategoryCoordinate[]>([]);
  animation = input<boolean>(true);
  isEdit = input(true);
  map = signal(null);
  markerLayer = [];

  iconSettings: IMarkerSvgIconSettings = {
    mapIconUrl:
      '<svg width="37" height="45" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.873 31.361c2.579-1.35 4.196-3.29 4.196-5.447 0-4.076-5.772-7.38-12.893-7.38-7.12 0-12.893 3.304-12.893 7.38 0 .703.172 1.383.493 2.027L13.636 42l18.238-10.639Z" fill="rgba(0,0,0,0.1)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.474 19.566a12.841 12.841 0 0 0 1.312-5.673C26.786 6.773 21.014 1 13.893 1 6.773 1 1 6.772 1 13.893c0 2.036.472 3.961 1.312 5.673h-.023L13.893 42l11.604-22.434h-.023Z" fill="{mapIconColor}" stroke="rgba(0,0,0,0.2)" stroke-width="2px"/><circle cx="13.893" cy="13.893" r="4.642" fill="#fff"/></svg>',
    mapIconColor: '#378CCD'
  };

  markerIcons: Record<number, IGetMarkerIcon> = {};

  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  options = {
    layers: [this.streetMaps],
    zoom: 1,
    center: latLng([0, 0])
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
      } else if (this.map && !this.coordinateList().length) {
        if (this.markerLayer.length) {
          this.clearMarker();
        }
      }
    });
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    const target = e.target as HTMLElement;
    if (target.classList.contains(LEAFLET_POPUP_ROUTERLINK_CLASSNAME) && !!target.dataset['routerLink']) {
      e.preventDefault();
      this.#router.navigateByUrl(target.dataset['routerLink']);
    }
  }

  addMarker({ lat, lng, msg, category, tag, color, routerLink }: ICategoryCoordinate) {
    const markerIcon = this.getMarkIcon(category, color);

    let link = '';
    if (routerLink) {
      link = `<a class="${LEAFLET_POPUP_ROUTERLINK_CLASSNAME}" data-router-link="${routerLink}" href="${routerLink}">${msg}</a>`;
    }

    const popupMsg = `
      ${tag ?? ''}
      <span>
        ${link ? link : msg}
      </span>
    `;

    const markerItem = marker([lat, lng], markerIcon).addTo(this.map()).bindPopup(popupMsg);
    this.markerLayer.push(markerItem);
  }

  getMarkIcon(type: any, color?: string): IGetMarkerIcon {
    if (!this.markerIcons[type]) {
      this.markerIcons[type] = this.setMarkIcon(color);
    }
    return this.markerIcons[type];
  }

  setMarkIcon(color?: string): IGetMarkerIcon {
    this.iconSettings.mapIconColor = color ?? '#378CCD';
    return {
      icon: divIcon({
        className: 'leaflet-data-marker',
        iconSize: [37, 45],
        iconAnchor: [14, 41],
        popupAnchor: [0, -45],
        html: Util.template(this.iconSettings.mapIconUrl, this.iconSettings)
      })
    };
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
