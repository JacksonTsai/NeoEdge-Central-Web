export interface ICoordinate {
  msg?: string;
  lat: number;
  lng: number;
}

export interface ICategoryCoordinate extends ICoordinate {
  category?: any;
  tag?: string;
  color?: string;
  routerLink?: string;
}

export type TICategoryCoordinate = Record<string, ICategoryCoordinate>;
