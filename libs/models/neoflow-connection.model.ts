import { LeaderLine } from './leader-line.model';
import { INeoFlowNode, INeoFlowNodeGroup } from './neoflow-node.model';

export interface INeoFlowConnectionState {
  sourceNodes: INeoFlowNodeGroup[];
  targetNodes: INeoFlowNodeGroup[];
  selectedNode: INeoFlowNode[];
  connection: LeaderLine[];
}
