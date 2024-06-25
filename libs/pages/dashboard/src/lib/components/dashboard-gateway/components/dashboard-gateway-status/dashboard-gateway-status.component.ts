import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { GATEWAY_STATUE, IPieChartSetting, TDashboardGatewayStatus } from '@neo-edge-web/models';
import { getChartColor } from '@neo-edge-web/utils';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

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
  public chartOptions = signal<Partial<ApexOptions> | null>(null);

  colorArr = getChartColor(5, 'status');

  constructor() {
    effect(
      () => {
        if (this.gatewaysStatusList() !== null) {
          this.buildChart();
        } else {
          this.buildEmptyChart();
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

  getChartOption(setting: IPieChartSetting): ApexOptions {
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
                offsetY: -18
              },
              value: {
                show: true,
                fontSize: '32px',
                fontWeight: 600,
                offsetY: 0
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

  buildEmptyChart() {
    const chartSetting: ApexOptions = {
      colors: ['#C9C9C9'],
      series: [100],
      labels: ['No Data'],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      chart: {
        type: 'donut',
        parentHeightOffset: 0,
        animations: {
          enabled: false
        }
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        }
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '32px',
                color: '#C9C9C9',
                offsetY: 4
              },
              value: {
                show: false
              },
              total: {
                show: true,
                label: 'No Data',
                color: '#C9C9C9'
              }
            }
          }
        }
      }
    };

    this.chartOptions.set(chartSetting);
  }
}
