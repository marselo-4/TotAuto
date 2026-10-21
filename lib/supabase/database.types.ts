// Generado desde el proyecto Supabase "totauto" (ogbngipmbclwloezlqqa) el 21/10/2026.
// Regenerar tras cada migración: conector Supabase → generate_typescript_types,
// o `supabase gen types typescript --project-id ogbngipmbclwloezlqqa > lib/supabase/database.types.ts`.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      leads: {
        Row: {
          created_at: string;
          email: string | null;
          extra: Json;
          id: string;
          locale: string;
          message: string | null;
          name: string;
          phone: string | null;
          sent_to_hubspot: boolean;
          type: Database["public"]["Enums"]["lead_type"];
          vehicle_id: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          extra?: Json;
          id?: string;
          locale?: string;
          message?: string | null;
          name: string;
          phone?: string | null;
          sent_to_hubspot?: boolean;
          type: Database["public"]["Enums"]["lead_type"];
          vehicle_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          extra?: Json;
          id?: string;
          locale?: string;
          message?: string | null;
          name?: string;
          phone?: string | null;
          sent_to_hubspot?: boolean;
          type?: Database["public"]["Enums"]["lead_type"];
          vehicle_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          company: string | null;
          created_at: string;
          full_name: string;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          full_name?: string;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          company?: string | null;
          created_at?: string;
          full_name?: string;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [];
      };
      vehicle_images: {
        Row: {
          alt: string | null;
          created_at: string;
          id: string;
          is_cover: boolean;
          path: string;
          position: number;
          vehicle_id: string;
        };
        Insert: {
          alt?: string | null;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          path: string;
          position?: number;
          vehicle_id: string;
        };
        Update: {
          alt?: string | null;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          path?: string;
          position?: number;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicles: {
        Row: {
          color: string | null;
          created_at: string;
          description_ca: string | null;
          description_es: string | null;
          featured: boolean;
          fuel: Database["public"]["Enums"]["fuel_type"];
          gearbox: Database["public"]["Enums"]["gearbox_type"];
          id: string;
          imported: boolean;
          km: number;
          make: string;
          model: string;
          origin_country: string | null;
          owner_id: string;
          power_cv: number | null;
          price_eur: number;
          registered_es: boolean;
          service_history: string | null;
          slug: string;
          sold_at: string | null;
          status: Database["public"]["Enums"]["vehicle_status"];
          updated_at: string;
          vat_deductible: boolean;
          version: string | null;
          warranty: string | null;
          year: number;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description_ca?: string | null;
          description_es?: string | null;
          featured?: boolean;
          fuel: Database["public"]["Enums"]["fuel_type"];
          gearbox: Database["public"]["Enums"]["gearbox_type"];
          id?: string;
          imported?: boolean;
          km?: number;
          make: string;
          model: string;
          origin_country?: string | null;
          owner_id: string;
          power_cv?: number | null;
          price_eur: number;
          registered_es?: boolean;
          service_history?: string | null;
          slug: string;
          sold_at?: string | null;
          status?: Database["public"]["Enums"]["vehicle_status"];
          updated_at?: string;
          vat_deductible?: boolean;
          version?: string | null;
          warranty?: string | null;
          year: number;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description_ca?: string | null;
          description_es?: string | null;
          featured?: boolean;
          fuel?: Database["public"]["Enums"]["fuel_type"];
          gearbox?: Database["public"]["Enums"]["gearbox_type"];
          id?: string;
          imported?: boolean;
          km?: number;
          make?: string;
          model?: string;
          origin_country?: string | null;
          owner_id?: string;
          power_cv?: number | null;
          price_eur?: number;
          registered_es?: boolean;
          service_history?: string | null;
          slug?: string;
          sold_at?: string | null;
          status?: Database["public"]["Enums"]["vehicle_status"];
          updated_at?: string;
          vat_deductible?: boolean;
          version?: string | null;
          warranty?: string | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      fuel_type: "gasolina" | "diesel" | "hibrido" | "hibrido_enchufable" | "electrico";
      gearbox_type: "manual" | "automatico";
      lead_type: "vehicle" | "import" | "sell" | "contact";
      user_role: "admin" | "seller";
      vehicle_status: "draft" | "available" | "reserved" | "sold";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];

export const Constants = {
  public: {
    Enums: {
      fuel_type: ["gasolina", "diesel", "hibrido", "hibrido_enchufable", "electrico"],
      gearbox_type: ["manual", "automatico"],
      lead_type: ["vehicle", "import", "sell", "contact"],
      user_role: ["admin", "seller"],
      vehicle_status: ["draft", "available", "reserved", "sold"],
    },
  },
} as const;
