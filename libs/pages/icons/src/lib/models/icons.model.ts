export interface ISvgItem {
  id: string;
  el: SVGElement;
}

export interface IIconInputValueSettings {
  tag: string;
  key: string;
}

export interface IIconSelectOption {
  name: SVG_ICON_LIST_TYPE;
  text: string;
  code: string;
}

export interface IIconStoreState {
  showType: SVG_ICON_LIST_TYPE;
  useAriaHidden: boolean;
}

export enum SVG_ICON_LIST_TYPE {
  FILE_NAME = 'name',
  HTML = 'html'
}
