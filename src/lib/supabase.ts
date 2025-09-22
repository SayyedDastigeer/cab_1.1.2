import { createClient } from "@supabase/supabase-js";

// Define your Database schema types
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          phone: string;
          password_hash: string;
          name: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          password_hash: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          password_hash?: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          service_type: "outstation" | "mumbai-local";
          from_location: string;
          to_location: string;
          car_type: string;
          travel_date: string;
          travel_time: string;
          estimated_price: number;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          service_type: "outstation" | "mumbai-local";
          from_location: string;
          to_location: string;
          car_type: string;
          travel_date: string;
          travel_time: string;
          estimated_price: number;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          service_type?: "outstation" | "mumbai-local";
          from_location?: string;
          to_location?: string;
          car_type?: string;
          travel_date?: string;
          travel_time?: string;
          estimated_price?: number;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      cities: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      routes: {
        Row: {
          id: string;
          from_city: string;
          to_city: string;
          price_4_seater: number;
          price_6_seater: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          from_city: string;
          to_city: string;
          price_4_seater: number;
          price_6_seater: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          from_city?: string;
          to_city?: string;
          price_4_seater?: number;
          price_6_seater?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      mumbai_pricing: {
        Row: {
          id: string;
          four_seater_rate: number;
          six_seater_rate: number;
          airport_four_seater_rate: number;
          airport_six_seater_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          four_seater_rate: number;
          six_seater_rate: number;
          airport_four_seater_rate: number;
          airport_six_seater_rate: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          four_seater_rate?: number;
          six_seater_rate?: number;
          airport_four_seater_rate?: number;
          airport_six_seater_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
