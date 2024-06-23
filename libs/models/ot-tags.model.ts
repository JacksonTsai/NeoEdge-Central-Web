export interface IOtTagsForUI {
  tagName: string;
  enable: boolean;
  tagType: { value: string };
  function: { value: number };
  startAddress: number;
  quantity: number;
  trigger: { value: string };
  interval: number;
  Quantity: number;
}

export interface IOtTag {
  tagName: string;
  enable: boolean;
  dataType: any;
  function: any;
  startAddress: number;
  quantity: number;
  trigger: any;
  interval: number;
}

export interface ICsvTag {
  data_type: string;
  enable: string;
  function: string;
  interval: string;
  quantity: string;
  start_address: string;
  tag_name: string;
  trigger: string;
}
