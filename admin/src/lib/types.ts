export interface UserPublic {
  id: number;
  username: string;
  email: string | null;
  role: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserPublic;
}

export interface Vehicle {
  id: number;
  code: string;
  name: string;
  tagline: string | null;
  passengers: number;
  luggage: string | null;
  features: string[];
  multiplier: number;
  sort_order: number;
  is_active: boolean;
}

export interface Airport {
  id: number;
  slug: string;
  name: string;
  short_name: string;
  iata: string;
  city: string;
  distance_miles: number;
  drive_time_mins: number;
  fare_from: number;
  description: string;
  highlights: string[];
  is_active: boolean;
  sort_order: number;
}

export interface Area {
  id: number;
  slug: string;
  name: string;
  description: string;
  postcode_prefixes: string[];
  is_active: boolean;
  sort_order: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Driver {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  license_number: string | null;
  vehicle_id: number | null;
  is_active: boolean;
  notes: string | null;
}

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  total_bookings: number;
  last_booking_at: string | null;
  created_at: string;
}

export interface FareBreakdown {
  base: number;
  surcharge: number;
  total: number;
  estimated_miles?: number;
  estimated_mins?: number;
  [key: string]: unknown;
}

export interface Booking {
  id: number;
  reference: string;
  status: string;
  trip_type: string;
  from_location: string;
  to_location: string;
  pickup_at: string;
  return_at: string | null;
  passengers: number;
  luggage: number;
  vehicle_code: string | null;
  flight_number: string | null;
  meet_greet: boolean;
  notes: string | null;
  customer_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  driver_id: number | null;
  fare_total: number;
  fare_currency: string;
  fare_breakdown: FareBreakdown | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: number;
  event: string;
  params: Record<string, unknown>;
  client_id: string | null;
  ip: string | null;
  user_agent: string | null;
  referer: string | null;
  page: string | null;
  created_at: string;
}

export interface OverviewStats {
  bookings_today: number;
  bookings_week: number;
  bookings_total: number;
  revenue_today: number;
  revenue_week: number;
  revenue_total: number;
  customers_total: number;
  pending_bookings: number;
  upcoming_24h: number;
  bookings_by_status: Record<string, number>;
  bookings_last_14d: { date: string; bookings: number; revenue: number }[];
}

export type SiteSettings = Record<string, Record<string, unknown> | unknown>;

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
