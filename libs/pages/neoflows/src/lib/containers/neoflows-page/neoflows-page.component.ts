import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableQueryForNeoFlows } from '@neo-edge-web/models';
import { NeoflowsComponent } from '../../components';

@Component({
  selector: 'ne-neoflow-page',
  standalone: true,
  imports: [CommonModule, NeoflowsComponent],
  template: `
    <ne-neoflows (handleCreateNeoFlow)="onCreateNeoFlow()" (handlePageChange)="onPageChange($event)"></ne-neoflows>
  `,
  styleUrl: './neoflows-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeoflowsPageComponent {
  // #neoflowStore = inject(NeoFlowsStore);

  onCreateNeoFlow = () => {
    this;
  };

  onPageChange = (event: TableQueryForNeoFlows) => {
    console.log(event);
    // this.#neoflowStore.queryOtDevicesTableByPage(event);
  };
}
