export type User = {
  id: string;
  email: string;
  homeCity?: Place;
  destination?: Place;
};
export type Place = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};
