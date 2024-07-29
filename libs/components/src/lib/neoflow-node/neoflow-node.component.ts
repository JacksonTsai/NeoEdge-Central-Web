import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { INeoFlowNode, INeoFlowNodeGroup, NEOFLOW_DATA_CLASS, NEOFLOW_SOCKET } from '@neo-edge-web/models';

@Component({
  selector: 'ne-neoflow-node',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './neoflow-node.component.html',
  styleUrl: './neoflow-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeoFlowNodeComponent {
  @Output() handleSelectedNode = new EventEmitter<INeoFlowNode>();
  @Output() handleRemovedLine = new EventEmitter<INeoFlowNode>();
  nodeGroup = input<INeoFlowNodeGroup>();
  selectedNode = input<INeoFlowNode[]>([]);

  isExpanded = signal(true);
  neoflowSocket = NEOFLOW_SOCKET;
  neoflowDataClass = NEOFLOW_DATA_CLASS;

  isSelected = (node: INeoFlowNode) => {
    return this.selectedNode().findIndex((d) => d.id === node.id) > -1 ? true : false;
  };

  changeExpand = () => {
    this.isExpanded.set(!this.isExpanded());
  };

  onSelectedNode = (node: INeoFlowNode) => {
    this.handleSelectedNode.emit(node);
  };

  onRemoveLine = (node: INeoFlowNode) => {
    console.log(node);
  };
}
