export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cron_job_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          job_name: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          job_name: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          job_name?: string
        }
        Relationships: []
      }
      marketplace_stats: {
        Row: {
          id: string
          latest_drop_time: string
          total_nfts: number
          total_sales: number
          updated_at: string
        }
        Insert: {
          id?: string
          latest_drop_time?: string
          total_nfts?: number
          total_sales?: number
          updated_at?: string
        }
        Update: {
          id?: string
          latest_drop_time?: string
          total_nfts?: number
          total_sales?: number
          updated_at?: string
        }
        Relationships: []
      }
      nft_bids: {
        Row: {
          bid_amount: number
          bidder_address: string
          created_at: string | null
          id: string
          marketplace: string | null
          nft_id: string
          verified: boolean | null
        }
        Insert: {
          bid_amount: number
          bidder_address: string
          created_at?: string | null
          id?: string
          marketplace?: string | null
          nft_id: string
          verified?: boolean | null
        }
        Update: {
          bid_amount?: number
          bidder_address?: string
          created_at?: string | null
          id?: string
          marketplace?: string | null
          nft_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_bids_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      nfts: {
        Row: {
          bidder_wallet_address: string | null
          created_at: string
          creator: string
          description: string | null
          for_sale: boolean | null
          id: string
          image: string
          marketplace: string | null
          name: string
          owner_id: string | null
          price: number
          properties: Json | null
        }
        Insert: {
          bidder_wallet_address?: string | null
          created_at?: string
          creator: string
          description?: string | null
          for_sale?: boolean | null
          id?: string
          image: string
          marketplace?: string | null
          name: string
          owner_id?: string | null
          price: number
          properties?: Json | null
        }
        Update: {
          bidder_wallet_address?: string | null
          created_at?: string
          creator?: string
          description?: string | null
          for_sale?: boolean | null
          id?: string
          image?: string
          marketplace?: string | null
          name?: string
          owner_id?: string | null
          price?: number
          properties?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number | null
          country: string | null
          created_at: string
          frozen_balance: number | null
          frozen_usdt_balance: number | null
          id: string
          kyc_address_doc: string | null
          kyc_identity_doc: string | null
          kyc_rejection_reason: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status_type"] | null
          login: string
          show_withdrawal_error_modal: boolean | null
          trc20_address: string | null
          usdt_balance: number | null
          user_id: string
          verified: boolean
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number | null
          country?: string | null
          created_at?: string
          frozen_balance?: number | null
          frozen_usdt_balance?: number | null
          id?: string
          kyc_address_doc?: string | null
          kyc_identity_doc?: string | null
          kyc_rejection_reason?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status_type"] | null
          login: string
          show_withdrawal_error_modal?: boolean | null
          trc20_address?: string | null
          usdt_balance?: number | null
          user_id: string
          verified?: boolean
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number | null
          country?: string | null
          created_at?: string
          frozen_balance?: number | null
          frozen_usdt_balance?: number | null
          id?: string
          kyc_address_doc?: string | null
          kyc_identity_doc?: string | null
          kyc_rejection_reason?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status_type"] | null
          login?: string
          show_withdrawal_error_modal?: boolean | null
          trc20_address?: string | null
          usdt_balance?: number | null
          user_id?: string
          verified?: boolean
          wallet_address?: string | null
        }
        Relationships: []
      }
      transaction_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency_type: string | null
          frozen_until: string | null
          id: string
          is_frozen: boolean | null
          is_frozen_exchange: boolean | null
          item: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_type?: string | null
          frozen_until?: string | null
          id?: string
          is_frozen?: boolean | null
          is_frozen_exchange?: boolean | null
          item?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_type?: string | null
          frozen_until?: string | null
          id?: string
          is_frozen?: boolean | null
          is_frozen_exchange?: boolean | null
          item?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_bid: { Args: { bid_id: string }; Returns: Json }
      decline_bid: { Args: { bid_id: string }; Returns: Json }
      exchange_to_usdt:
        | { Args: { amount: number }; Returns: Json }
        | { Args: { amount: number; is_frozen?: boolean }; Returns: Json }
      get_marketplace_stats: { Args: never; Returns: Json }
      get_user_frozen_balances: {
        Args: { user_uuid: string }
        Returns: {
          frozen_balance: number
          frozen_usdt_balance: number
          unfreezing_in_days: Json[]
        }[]
      }
      get_user_transaction_totals: {
        Args: { user_uuid: string }
        Returns: {
          total_deposits: number
          total_withdrawals: number
        }[]
      }
      process_expired_frozen_transactions: { Args: never; Returns: number }
      process_frozen_balances: { Args: never; Returns: undefined }
      purchase_nft: { Args: { nft_id: string }; Returns: Json }
      scheduled_process_expired_frozen_transactions: {
        Args: never
        Returns: undefined
      }
      set_withdrawal_error_modal_flag: {
        Args: { show_modal: boolean; target_user_id: string }
        Returns: Json
      }
      update_frozen_transaction_currency: {
        Args: { new_currency_type: string; transaction_id: string }
        Returns: Json
      }
      update_marketplace_stats: { Args: never; Returns: Json }
    }
    Enums: {
      kyc_status_type:
        | "not_started"
        | "identity_submitted"
        | "address_submitted"
        | "under_review"
        | "verified"
        | "rejected"
      transaction_status: "pending" | "completed" | "failed"
      transaction_type:
        | "deposit"
        | "withdraw"
        | "purchase"
        | "sale"
        | "exchange"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      kyc_status_type: [
        "not_started",
        "identity_submitted",
        "address_submitted",
        "under_review",
        "verified",
        "rejected",
      ],
      transaction_status: ["pending", "completed", "failed"],
      transaction_type: ["deposit", "withdraw", "purchase", "sale", "exchange"],
    },
  },
} as const
