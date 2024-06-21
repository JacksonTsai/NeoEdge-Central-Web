export interface ICoordinate {
  msg?: string;
  lat: number;
  lng: number;
}

export type TCategoryCoordinate = ICoordinate & {
  category?: any;
};
