import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { NeMapMultipleMarkComponent } from '@neo-edge-web/components';
import { GATEWAY_STATUE, Gateway, TCategoryCoordinate } from '@neo-edge-web/models';

interface IStatusItem {
  value: any;
  label: string;
}
@Component({
  selector: 'ne-dashboard-gateway-location',
  standalone: true,
  imports: [CommonModule, MatChipsModule, NeMapMultipleMarkComponent],
  templateUrl: './dashboard-gateway-location.component.html',
  styleUrl: './dashboard-gateway-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardGatewayLocationComponent {
  gatewaysList = input<Gateway[]>([]);
  gatewayStatus = GATEWAY_STATUE;
  gatewayStatusSelect = signal<number[]>([]);

  coordinateList = computed<TCategoryCoordinate[]>(() => {
    if (!this.gatewaysList().length) return [];

    let result: TCategoryCoordinate[] = this.gatewaysList().map((gateway) => {
      return {
        msg: gateway.name,
        category: gateway.connectionStatus,
        lat: gateway.latitude,
        lng: gateway.longitude
      };
    });

    if (this.gatewayStatusSelect().length > 0) {
      result = result.filter((coordinate) => {
        return this.gatewayStatusSelect().includes(coordinate.category);
      });
    }

    return result;
  });

  statusList = computed<IStatusItem[]>(() => {
    const result: IStatusItem[] = [];
    Object.entries(this.gatewayStatus).forEach(([key, value]) => {
      if (typeof value !== 'number') {
        result.push({
          value: parseInt(key, 10),
          label: value
        });
      }
    });
    return result;
  });

  onChangeFilter(event: MatChipListboxChange): void {
    this.gatewayStatusSelect.set(event.value);
  }
}
