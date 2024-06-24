import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { GATEWAY_STATUE, IPieChartSetting, TDashboardGatewayStatus, TPieChartOptions } from '@neo-edge-web/models';
import { getChartColor } from '@neo-edge-web/utils';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'ne-dashboard-gateway-status',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard-gateway-status.component.html',
  styleUrl: './dashboard-gateway-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardGatewayStatusComponent {
  gatewaysStatusList = input<TDashboardGatewayStatus>(null);
  gatewayStatus = GATEWAY_STATUE;
  public chartOptions = signal<Partial<TPieChartOptions> | null>(null);

  colorArr = getChartColor(5, 'status');

  constructor() {
    effect(
      () => {
        if (this.gatewaysStatusList() !== null) {
          this.buildChart();
        }
      },
      { allowSignalWrites: true }
    );
  }

  buildChart() {
    const chartSetting: IPieChartSetting = {
      series: [],
      labels: []
    };

    Object.entries(this.gatewaysStatusList()).forEach(([key, value]) => {
      chartSetting.series[key] = value.list.length;
      chartSetting.labels[key] = value.name;
    });

    this.chartOptions.set(this.getChartOption(chartSetting));
  }

  getChartOption(setting: IPieChartSetting): TPieChartOptions {
    return {
      colors: this.colorArr,
      chart: {
        type: 'donut',
        parentHeightOffset: 0
      },
      series: setting.series,
      labels: setting.labels,
      legend: {
        position: 'top'
      },
      tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          let total = 0;
          for (const x of series) {
            total += x;
          }
          const selected = series[seriesIndex];
          return `
          <div style="color:white;background-color:${this.colorArr[seriesIndex]};font-size:12px;padding:4px 8px;">
            ${w.config.labels[seriesIndex]}: ${selected} (${((selected / total) * 100).toFixed(2)}%)
          </div>
          `;
        }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                color: 'currentColor',
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '32px',
                fontWeight: 600
              },
              total: {
                show: true,
                label: 'Total'
              }
            }
          }
        }
      }
    };
  }
}
