import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, OnInit, signal } from '@angular/core';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NeMapMultipleMarkComponent } from '@neo-edge-web/components';
import { Gateway, GATEWAY_STATUE, STATUS_COLORS, TCategoryCoordinate } from '@neo-edge-web/models';

interface IStatusItem {
  value: any;
  label: string;
  icon: string;
}
@Component({
  selector: 'ne-dashboard-gateway-location',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, NeMapMultipleMarkComponent],
  templateUrl: './dashboard-gateway-location.component.html',
  styleUrl: './dashboard-gateway-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardGatewayLocationComponent implements OnInit {
  gatewaysList = input<Gateway[]>([]);
  gatewayStatus = GATEWAY_STATUE;
  gatewayStatusSelect = signal<number[]>([]);

  gatewayStatusIcon: Record<number, string> = {
    0: '/assets/images/waiting.svg',
    1: '/assets/images/connected.svg',
    2: '/assets/images/disconnected.svg',
    3: '/assets/images/detach.svg'
  };

  gatewayStatusColor: Record<number, STATUS_COLORS> = {
    0: STATUS_COLORS.Waiting,
    1: STATUS_COLORS.Connected,
    2: STATUS_COLORS.Disconnected,
    3: STATUS_COLORS.Detach
  };

  coordinateList = computed<TCategoryCoordinate[]>(() => {
    if (!this.gatewaysList().length) return [];

    let result: TCategoryCoordinate[] = this.gatewaysList().map((gateway) => {
      const status = gateway.connectionStatus;
      const img = `<img src="${this.gatewayStatusIcon[status]}" width="24" height="24" alt="" />`;
      const tag = `<span class="gateway-status-tag" style="--primary-color: ${this.gatewayStatusColor[status]}">${img}${this.gatewayStatus[status]}</span>`;
      return {
        tag: tag,
        msg: gateway.name,
        category: status,
        lat: gateway.latitude,
        lng: gateway.longitude,
        color: this.gatewayStatusColor[status],
        routerLink: `/project/gateways/${gateway.id}`
      };
    });

    if (this.gatewayStatusSelect().length > 0) {
      return (result = result.filter((coordinate) => {
        return this.gatewayStatusSelect().includes(coordinate.category);
      }));
    } else {
      return [];
    }
  });

  statusList = computed<IStatusItem[]>(() => {
    const result: IStatusItem[] = [];
    Object.entries(this.gatewayStatus).forEach(([key, value]) => {
      if (typeof value !== 'number') {
        result.push({
          value: parseInt(key, 10),
          label: value,
          icon: value.toLowerCase()
        });
      }
    });
    return result;
  });

  onChangeFilter(event: MatChipListboxChange): void {
    this.gatewayStatusSelect.set(event.value);
  }

  createEnumArray = (enumObj: any): number[] => {
    return Object.values(enumObj).filter((value) => typeof value === 'number') as number[];
  };

  ngOnInit(): void {
    this.gatewayStatusSelect.set(this.createEnumArray(GATEWAY_STATUE));
  }
}
