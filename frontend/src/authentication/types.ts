export type User = {
  id: string;
  email: string;
  homeCity?: string;
  destination?: {
    id: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  } | null;
};
