export type UserRole = 'student' | 'driver';

export type CrowdLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';

export type CameraLocation = 'dashcam' | 'cabin' | 'door' | 'campus_gate';

export interface CCTVCamera {
  id: string;
  name: string;
  location: CameraLocation;
  busId?: string;
  busNumber?: string;
  resolution: string;
  fps: number;
  status: 'ONLINE' | 'RECORDING' | 'OFFLINE';
  description: string;
  hasAudio: boolean;
}

export interface BusStop {
  id: string;
  name: string;
  stopNumber: number;
  etaMinutes: number; // minutes from origin or dynamic relative to bus
  coords: { x: number; y: number }; // Relative 0-1000 coordinate on campus canvas
  isUserStop?: boolean;
}

export interface BusRoute {
  id: string;
  busNumber: string;
  name: string;
  routeTitle: string; // e.g. "Hostel → College"
  status: 'Active' | 'Not Started' | 'Delayed' | 'Completed';
  driverName: string;
  driverPhone: string;
  plateNumber: string;
  busType: string;
  stops: BusStop[];
  totalDistanceKm: number;
  departureTime: string;
  arrivalTime: string;
}

export interface AppNotification {
  id: string;
  type: 'bus_started' | 'approaching' | 'crowd' | 'alert' | 'delay';
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
}
