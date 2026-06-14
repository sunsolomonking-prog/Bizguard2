// Supabase Database Types for BizGuard
// Generated types - update when schema changes

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          type: string;
          industry: string;
          location: string;
          currency: string;
          timezone: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          industry: string;
          location: string;
          currency: string;
          timezone: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          industry?: string;
          location?: string;
          currency?: string;
          timezone?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          business_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          business_id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          business_id?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          sku: string;
          category: string;
          description: string | null;
          cost_price: number;
          selling_price: number;
          quantity: number;
          reorder_level: number;
          supplier: string | null;
          barcode: string | null;
          images: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          sku: string;
          category: string;
          description?: string | null;
          cost_price: number;
          selling_price: number;
          quantity?: number;
          reorder_level?: number;
          supplier?: string | null;
          barcode?: string | null;
          images?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          sku?: string;
          category?: string;
          description?: string | null;
          cost_price?: number;
          selling_price?: number;
          quantity?: number;
          reorder_level?: number;
          supplier?: string | null;
          barcode?: string | null;
          images?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sales: {
        Row: {
          id: string;
          business_id: string;
          customer_id: string | null;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          payment_method: string;
          status: string;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          customer_id?: string | null;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          payment_method: string;
          status: string;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          customer_id?: string | null;
          subtotal?: number;
          tax?: number;
          discount?: number;
          total?: number;
          payment_method?: string;
          status?: string;
          created_at?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          discount: number;
          total: number;
        };
        Insert: {
          id?: string;
          sale_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          discount: number;
          total: number;
        };
        Update: {
          id?: string;
          sale_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          discount?: number;
          total?: number;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          credit_limit: number;
          current_balance: number;
          total_purchases: number;
          last_purchase_date: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          credit_limit?: number;
          current_balance?: number;
          total_purchases?: number;
          last_purchase_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          credit_limit?: number;
          current_balance?: number;
          total_purchases?: number;
          last_purchase_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          business_id: string;
          customer_id: string;
          invoice_number: string;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          amount_paid: number;
          balance: number;
          due_date: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          customer_id: string;
          invoice_number: string;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          amount_paid?: number;
          balance: number;
          due_date: string;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          customer_id?: string;
          invoice_number?: string;
          subtotal?: number;
          tax?: number;
          discount?: number;
          total?: number;
          amount_paid?: number;
          balance?: number;
          due_date?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      alerts: {
        Row: {
          id: string;
          business_id: string;
          type: string;
          severity: string;
          title: string;
          message: string;
          is_read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          type: string;
          severity: string;
          title: string;
          message: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          type?: string;
          severity?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      action_cards: {
        Row: {
          id: string;
          business_id: string;
          type: string;
          title: string;
          description: string;
          priority: number;
          completed: boolean;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          type: string;
          title: string;
          description: string;
          priority: number;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          type?: string;
          title?: string;
          description?: string;
          priority?: number;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      stock_movements: {
        Row: {
          id: string;
          business_id: string;
          product_id: string;
          type: string;
          quantity: number;
          reason: string;
          reference: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          product_id: string;
          type: string;
          quantity: number;
          reason: string;
          reference?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          product_id?: string;
          type?: string;
          quantity?: number;
          reason?: string;
          reference?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
