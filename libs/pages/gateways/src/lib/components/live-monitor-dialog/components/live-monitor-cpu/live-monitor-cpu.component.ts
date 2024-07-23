import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ILiveMonitorChart } from '@neo-edge-web/models';
import { getLiveMonitorChartOption } from '@neo-edge-web/utils';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'ne-live-monitor-cpu',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgApexchartsModule],
  templateUrl: './live-monitor-cpu.component.html',
  styleUrl: './live-monitor-cpu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorCpuComponent {
  chartOptions = signal<Partial<ApexOptions> | null>(null);

  constructor() {
    effect(
      () => {
        this.buildChart();
        // if (this.projectFee() !== null) {
        // }
      },
      { allowSignalWrites: true }
    );
  }

  buildChart = (): void => {
    const chartSetting: ILiveMonitorChart = {
      type: 'CPU',
      series: [10, 41, 35, 51, 49, 62, 69, 91, 11]
    };

    this.chartOptions.set(getLiveMonitorChartOption(chartSetting));
  };
}
