export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      debate_sessions: {
        Row: {
          id: string
          user_id: string
          topic_id: string | null
          position: string
          duration_seconds: number | null
          ai_opponent_response: string | null
          user_score: number | null
          ai_score: number | null
          feedback: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          topic_id?: string | null
          position: string
          duration_seconds?: number | null
          ai_opponent_response?: string | null
          user_score?: number | null
          ai_score?: number | null
          feedback?: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string | null
          position?: string
          duration_seconds?: number | null
          ai_opponent_response?: string | null
          user_score?: number | null
          ai_score?: number | null
          feedback?: Json
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debate_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debate_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      speech_sessions: {
        Row: {
          id: string
          user_id: string
          topic_id: string | null
          title: string | null
          audio_url: string | null
          transcript: string | null
          duration_seconds: number | null
          clarity_score: number | null
          pace_score: number | null
          volume_score: number | null
          tone_score: number | null
          engagement_score: number | null
          overall_score: number | null
          feedback: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          topic_id?: string | null
          title?: string | null
          audio_url?: string | null
          transcript?: string | null
          duration_seconds?: number | null
          clarity_score?: number | null
          pace_score?: number | null
          volume_score?: number | null
          tone_score?: number | null
          engagement_score?: number | null
          overall_score?: number | null
          feedback?: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string | null
          title?: string | null
          audio_url?: string | null
          transcript?: string | null
          duration_seconds?: number | null
          clarity_score?: number | null
          pace_score?: number | null
          volume_score?: number | null
          tone_score?: number | null
          engagement_score?: number | null
          overall_score?: number | null
          feedback?: Json
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "speech_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speech_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["team_member_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_member_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_member_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          leader_id: string
          description: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          leader_id: string
          description?: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          leader_id?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          goals: string | null
          preferences: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          goals?: string | null
          preferences?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          goals?: string | null
          preferences?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      debate_position: "pro" | "con"
      team_member_role: "leader" | "member"
      user_role: "student" | "coach" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      debate_position: ["pro", "con"],
      team_member_role: ["leader", "member"],
      user_role: ["student", "coach", "admin"],
    },
  },
} as const
