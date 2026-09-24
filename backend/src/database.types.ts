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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analysis_results: {
        Row: {
          case_id: string
          citations: Json
          created_at: string
          final_score: number
          findings: Json
          id: string
          multilingual_summaries: Json
          owner_id: string
          report_json: Json
          risk_tier: string
        }
        Insert: {
          case_id: string
          citations?: Json
          created_at?: string
          final_score: number
          findings: Json
          id?: string
          multilingual_summaries?: Json
          owner_id: string
          report_json: Json
          risk_tier: string
        }
        Update: {
          case_id?: string
          citations?: Json
          created_at?: string
          final_score?: number
          findings?: Json
          id?: string
          multilingual_summaries?: Json
          owner_id?: string
          report_json?: Json
          risk_tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "medical_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_opinions: {
        Row: {
          case_id: string
          created_at: string
          diagnosis: string
          doctor_name: string
          id: string
          notes: string | null
          owner_id: string
          prescriptions: Json
          specialty: string
          tests: Json
          treatment: string
          urgency: string
        }
        Insert: {
          case_id: string
          created_at?: string
          diagnosis: string
          doctor_name: string
          id?: string
          notes?: string | null
          owner_id: string
          prescriptions?: Json
          specialty: string
          tests?: Json
          treatment: string
          urgency: string
        }
        Update: {
          case_id?: string
          created_at?: string
          diagnosis?: string
          doctor_name?: string
          id?: string
          notes?: string | null
          owner_id?: string
          prescriptions?: Json
          specialty?: string
          tests?: Json
          treatment?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_opinions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "medical_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_cases: {
        Row: {
          case_label: string | null
          comorbidities: Json
          created_at: string
          id: string
          language: string
          owner_id: string
          patient_age: number | null
          primary_condition: string
          symptoms: Json
          updated_at: string
        }
        Insert: {
          case_label?: string | null
          comorbidities?: Json
          created_at?: string
          id?: string
          language?: string
          owner_id: string
          patient_age?: number | null
          primary_condition: string
          symptoms?: Json
          updated_at?: string
        }
        Update: {
          case_label?: string | null
          comorbidities?: Json
          created_at?: string
          id?: string
          language?: string
          owner_id?: string
          patient_age?: number | null
          primary_condition?: string
          symptoms?: Json
          updated_at?: string
        }
        Relationships: []
      }
      medical_evidence: {
        Row: {
          condition: string | null
          confidence: number
          content: string
          corpus_category: string
          created_at: string
          disease: string | null
          embedding: string | null
          id: string
          metadata: Json
          source: string
          source_url: string | null
          specialty: string | null
          title: string
          urgency: string | null
        }
        Insert: {
          condition?: string | null
          confidence?: number
          content: string
          corpus_category: string
          created_at?: string
          disease?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json
          source: string
          source_url?: string | null
          specialty?: string | null
          title: string
          urgency?: string | null
        }
        Update: {
          condition?: string | null
          confidence?: number
          content?: string
          corpus_category?: string
          created_at?: string
          disease?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json
          source?: string
          source_url?: string | null
          specialty?: string | null
          title?: string
          urgency?: string | null
        }
        Relationships: []
      }
      uploaded_files: {
        Row: {
          case_id: string | null
          created_at: string
          extracted_json: Json | null
          file_name: string
          id: string
          mime_type: string
          ocr_confidence: number | null
          ocr_status: string
          owner_id: string
          storage_path: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          extracted_json?: Json | null
          file_name: string
          id?: string
          mime_type: string
          ocr_confidence?: number | null
          ocr_status?: string
          owner_id: string
          storage_path: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          extracted_json?: Json | null
          file_name?: string
          id?: string
          mime_type?: string
          ocr_confidence?: number | null
          ocr_status?: string
          owner_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "medical_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      voice_sessions: {
        Row: {
          case_id: string | null
          created_at: string
          id: string
          language: string
          livekit_room: string
          owner_id: string
          transcript: Json
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          id?: string
          language: string
          livekit_room: string
          owner_id: string
          transcript?: Json
        }
        Update: {
          case_id?: string | null
          created_at?: string
          id?: string
          language?: string
          livekit_room?: string
          owner_id?: string
          transcript?: Json
        }
        Relationships: [
          {
            foreignKeyName: "voice_sessions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "medical_cases"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
