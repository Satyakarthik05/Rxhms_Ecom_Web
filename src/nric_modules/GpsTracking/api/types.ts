export interface Customer {
  id: number;
  email: string;
  password?: string;
  latitude: number;
  longitude: number;
  location?: string;
  pincode?: string;
}

export interface Shop {
  id: number;
  name: string;
  location: string;
  pincode: string;
  coordinates: { lat: number; lng: number }[];
  isInside?: boolean;
}

export interface Item {
  id: number;
  name: string;
  price: number;
}

export interface Order {
  id: number;
  itemName: string;
  status: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}