export interface IPosition {
  lat: number;
  lng: number;
}

export interface CityType {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: IPosition;
  id: string;
}
