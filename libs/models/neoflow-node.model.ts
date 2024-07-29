export interface INeoFlowNodeGroup {
  id: string;
  name: string;
  socket: NEOFLOW_SOCKET;
  extended: boolean;
  nodes: INeoFlowNode[];
  properties?: any;
}

export interface INeoFlowNode {
  id: string;
  name: string;
  socket: NEOFLOW_SOCKET;
  dataClass: NEOFLOW_DATA_CLASS;
  property?: any;
}

export enum NEOFLOW_SOCKET {
  INPUT,
  OUTPUT
}

export enum NEOFLOW_DATA_CLASS {
  ATTRIBUTE = 'Attribute',
  TAG = 'Tag',
  STATIC = 'Static'
}

export interface INeoFlowProcessor {
  property?: any;
}
