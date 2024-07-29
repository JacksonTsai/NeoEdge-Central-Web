export interface LeaderLine {
  end: Element;
  start: Element;
  size: number;
  color: string;
  startSocketGravity: string;
  endSocketGravity: string;
  startPlugColor: string;
  endPlugColor: string;
  startPlugSize: number;
  endPlugSize: number;
  outline: boolean;
  outlineColor: string;
  outlineSize: number;
  startPlugOutline: boolean;
  endPlugOutline: boolean;
  startPlugOutlineColor: string;
  endPlugOutlineColor: string;
  startPlugOutlineSize: number;
  endPlugOutlineSize: number;
  path: any;
  startSocket: any;
  endSocket: any;
  startPlug: any;
  endPlug: any;
  dash: any;
  gradient: any;
  dropShadow: any;
  startLabel: any;
  endLabel: any;
  middleLabel: any;

  hide: (...v) => void;
  show: (...v) => void;
  remove(): void;
  position(): void;
  setOptions: (options) => void;
}
