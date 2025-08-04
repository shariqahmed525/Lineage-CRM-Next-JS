export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity: {
        Row: {
          action_date: string | null
          action_type: string
          activity_id: string
          activity_metadata: Json | null
          created_by: string | null
          lead_id: string | null
          new_lead_status_id: string | null
          note: string | null
          old_lead_status_id: string | null
        }
        Insert: {
          action_date?: string | null
          action_type: string
          activity_id?: string
          activity_metadata?: Json | null
          created_by?: string | null
          lead_id?: string | null
          new_lead_status_id?: string | null
          note?: string | null
          old_lead_status_id?: string | null
        }
        Update: {
          action_date?: string | null
          action_type?: string
          activity_id?: string
          activity_metadata?: Json | null
          created_by?: string | null
          lead_id?: string | null
          new_lead_status_id?: string | null
          note?: string | null
          old_lead_status_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_activity_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_activity_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_activity_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
        ]
      }
      agent_commission_rates: {
        Row: {
          commission_id: string
          commission_rate: number
          created_at: string | null
          plan_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          commission_id?: string
          commission_rate: number
          created_at?: string | null
          plan_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          commission_id?: string
          commission_rate?: number
          created_at?: string | null
          plan_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_commission_rates_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "carrier_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "agent_commission_rates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      annual_goals: {
        Row: {
          ap_goal: number
          created_at: string | null
          goal_id: string
          updated_at: string | null
          user_id: string | null
          year: number
        }
        Insert: {
          ap_goal: number
          created_at?: string | null
          goal_id?: string
          updated_at?: string | null
          user_id?: string | null
          year: number
        }
        Update: {
          ap_goal?: number
          created_at?: string | null
          goal_id?: string
          updated_at?: string | null
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "annual_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      application_history: {
        Row: {
          application_id: string | null
          change_date: string | null
          change_description: string
          changed_by: string | null
          history_id: string
        }
        Insert: {
          application_id?: string | null
          change_date?: string | null
          change_description: string
          changed_by?: string | null
          history_id?: string
        }
        Update: {
          application_id?: string | null
          change_date?: string | null
          change_description?: string
          changed_by?: string | null
          history_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "application_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      application_status: {
        Row: {
          id: number
          status_value: string
        }
        Insert: {
          id?: number
          status_value: string
        }
        Update: {
          id?: number
          status_value?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          additional_notes: string | null
          age_on_effective_date: number | null
          age_on_replacement_date: string | null
          application_date: string
          application_id: string
          cancel_or_cash_in_date: string | null
          carrier_1: string | null
          carrier_2: string | null
          carrier_plan_1: string | null
          carrier_plan_2: string | null
          city: string | null
          commission_rate: number
          county_id: string | null
          coverage_type: number | null
          created_at: string | null
          dob: string | null
          effective_date: string | null
          effective_first_draft_date: string | null
          face_amount: number | null
          first_name: string | null
          gender: string | null
          has_bank_draft_been_stopped: boolean | null
          last_name: string | null
          lead_id: string | null
          middle_initial: string | null
          monthly_premium: number | null
          payment_day: number | null
          payment_method: number | null
          payment_mode: number | null
          person_id: string | null
          phone1: string | null
          plan_id: string | null
          policy_number: string | null
          replaced_carrier_1: string | null
          replaced_carrier_2: string | null
          replaced_coverage_type: string | null
          replaced_face_amount: string | null
          replaced_has_bank_draft_been_stopped: boolean | null
          replaced_policy_number: string | null
          replaced_premium_amount: string | null
          replacing_existing_coverage: boolean | null
          state_code: string | null
          status: number | null
          street_address: string | null
          street_address2: string | null
          tobacco_use: string | null
          updated_at: string | null
          user_id: string | null
          zip: string | null
        }
        Insert: {
          additional_notes?: string | null
          age_on_effective_date?: number | null
          age_on_replacement_date?: string | null
          application_date: string
          application_id?: string
          cancel_or_cash_in_date?: string | null
          carrier_1?: string | null
          carrier_2?: string | null
          carrier_plan_1?: string | null
          carrier_plan_2?: string | null
          city?: string | null
          commission_rate: number
          county_id?: string | null
          coverage_type?: number | null
          created_at?: string | null
          dob?: string | null
          effective_date?: string | null
          effective_first_draft_date?: string | null
          face_amount?: number | null
          first_name?: string | null
          gender?: string | null
          has_bank_draft_been_stopped?: boolean | null
          last_name?: string | null
          lead_id?: string | null
          middle_initial?: string | null
          monthly_premium?: number | null
          payment_day?: number | null
          payment_method?: number | null
          payment_mode?: number | null
          person_id?: string | null
          phone1?: string | null
          plan_id?: string | null
          policy_number?: string | null
          replaced_carrier_1?: string | null
          replaced_carrier_2?: string | null
          replaced_coverage_type?: string | null
          replaced_face_amount?: string | null
          replaced_has_bank_draft_been_stopped?: boolean | null
          replaced_policy_number?: string | null
          replaced_premium_amount?: string | null
          replacing_existing_coverage?: boolean | null
          state_code?: string | null
          status?: number | null
          street_address?: string | null
          street_address2?: string | null
          tobacco_use?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          additional_notes?: string | null
          age_on_effective_date?: number | null
          age_on_replacement_date?: string | null
          application_date?: string
          application_id?: string
          cancel_or_cash_in_date?: string | null
          carrier_1?: string | null
          carrier_2?: string | null
          carrier_plan_1?: string | null
          carrier_plan_2?: string | null
          city?: string | null
          commission_rate?: number
          county_id?: string | null
          coverage_type?: number | null
          created_at?: string | null
          dob?: string | null
          effective_date?: string | null
          effective_first_draft_date?: string | null
          face_amount?: number | null
          first_name?: string | null
          gender?: string | null
          has_bank_draft_been_stopped?: boolean | null
          last_name?: string | null
          lead_id?: string | null
          middle_initial?: string | null
          monthly_premium?: number | null
          payment_day?: number | null
          payment_method?: number | null
          payment_mode?: number | null
          person_id?: string | null
          phone1?: string | null
          plan_id?: string | null
          policy_number?: string | null
          replaced_carrier_1?: string | null
          replaced_carrier_2?: string | null
          replaced_coverage_type?: string | null
          replaced_face_amount?: string | null
          replaced_has_bank_draft_been_stopped?: boolean | null
          replaced_policy_number?: string | null
          replaced_premium_amount?: string | null
          replacing_existing_coverage?: boolean | null
          state_code?: string | null
          status?: number | null
          street_address?: string | null
          street_address2?: string | null
          tobacco_use?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "applications_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["person_id"]
          },
          {
            foreignKeyName: "applications_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "carrier_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_carrier_1"
            columns: ["carrier_1"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["carrier_id"]
          },
          {
            foreignKeyName: "fk_applications_carrier_2"
            columns: ["carrier_2"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["carrier_id"]
          },
          {
            foreignKeyName: "fk_applications_carrier_plan_1"
            columns: ["carrier_plan_1"]
            isOneToOne: false
            referencedRelation: "carrier_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "fk_applications_carrier_plan_2"
            columns: ["carrier_plan_2"]
            isOneToOne: false
            referencedRelation: "carrier_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "fk_applications_coverage_type"
            columns: ["coverage_type"]
            isOneToOne: false
            referencedRelation: "plan_coverage_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_payment_day"
            columns: ["payment_day"]
            isOneToOne: false
            referencedRelation: "plan_payment_day"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_payment_method"
            columns: ["payment_method"]
            isOneToOne: false
            referencedRelation: "plan_payment_method"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_payment_mode"
            columns: ["payment_mode"]
            isOneToOne: false
            referencedRelation: "plan_payment_mode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_replaced_carrier_1"
            columns: ["replaced_carrier_1"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["carrier_id"]
          },
          {
            foreignKeyName: "fk_applications_replaced_carrier_2"
            columns: ["replaced_carrier_2"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["carrier_id"]
          },
          {
            foreignKeyName: "fk_applications_status"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "application_status"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_id: string
          end_date: string | null
          google_event_id: string | null
          last_fetch: string | null
          lead_id: string | null
          note: string | null
          start_date: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string
          end_date?: string | null
          google_event_id?: string | null
          last_fetch?: string | null
          lead_id?: string | null
          note?: string | null
          start_date?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string
          end_date?: string | null
          google_event_id?: string | null
          last_fetch?: string | null
          lead_id?: string | null
          note?: string | null
          start_date?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      callback_phone_numbers: {
        Row: {
          created_at: string
          phone_number: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          phone_number?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          phone_number?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_callback_phone_numbers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      carrier_plan_statuses: {
        Row: {
          description: string | null
          status_id: string
          status_name: string
        }
        Insert: {
          description?: string | null
          status_id?: string
          status_name: string
        }
        Update: {
          description?: string | null
          status_id?: string
          status_name?: string
        }
        Relationships: []
      }
      carrier_plans: {
        Row: {
          carrier_id: string | null
          created_at: string | null
          default_commission_rate: number | null
          parent_code: string | null
          plan_code: string | null
          plan_id: string
          plan_name: string
          status_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          carrier_id?: string | null
          created_at?: string | null
          default_commission_rate?: number | null
          parent_code?: string | null
          plan_code?: string | null
          plan_id?: string
          plan_name: string
          status_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          carrier_id?: string | null
          created_at?: string | null
          default_commission_rate?: number | null
          parent_code?: string | null
          plan_code?: string | null
          plan_id?: string
          plan_name?: string
          status_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carrier_plans_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["carrier_id"]
          },
          {
            foreignKeyName: "carrier_plans_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "carrier_plan_statuses"
            referencedColumns: ["status_id"]
          },
          {
            foreignKeyName: "fk_carrier_plans_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      carriers: {
        Row: {
          carrier_id: string
          carrier_name: string
          created_at: string | null
          logo_url: string | null
          parent_code: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          carrier_id?: string
          carrier_name: string
          created_at?: string | null
          logo_url?: string | null
          parent_code?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          carrier_id?: string
          carrier_name?: string
          created_at?: string | null
          logo_url?: string | null
          parent_code?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_carriers_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      counties: {
        Row: {
          county_id: string
          county_name: string
          state_name: string
        }
        Insert: {
          county_id?: string
          county_name: string
          state_name: string
        }
        Update: {
          county_id?: string
          county_name?: string
          state_name?: string
        }
        Relationships: []
      }
      duplicates: {
        Row: {
          created_at: string | null
          duplicate_data: Json | null
          duplicate_id: number
          existing_lead_id: string | null
          upload_run_id: number | null
        }
        Insert: {
          created_at?: string | null
          duplicate_data?: Json | null
          duplicate_id?: number
          existing_lead_id?: string | null
          upload_run_id?: number | null
        }
        Update: {
          created_at?: string | null
          duplicate_data?: Json | null
          duplicate_id?: number
          existing_lead_id?: string | null
          upload_run_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "duplicates_existing_lead_id_fkey"
            columns: ["existing_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duplicates_existing_lead_id_fkey"
            columns: ["existing_lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "duplicates_upload_run_id_fkey"
            columns: ["upload_run_id"]
            isOneToOne: false
            referencedRelation: "upload_runs"
            referencedColumns: ["upload_run_id"]
          },
        ]
      }
      filters: {
        Row: {
          cities: string[]
          counties: string[]
          id: string
          lead_sources: string[]
          lead_statuses: string[]
          name: string | null
          states: string[]
          user_id: string
          zip_codes: string[]
        }
        Insert: {
          cities: string[]
          counties: string[]
          id?: string
          lead_sources: string[]
          lead_statuses: string[]
          name?: string | null
          states: string[]
          user_id: string
          zip_codes: string[]
        }
        Update: {
          cities?: string[]
          counties?: string[]
          id?: string
          lead_sources?: string[]
          lead_statuses?: string[]
          name?: string | null
          states?: string[]
          user_id?: string
          zip_codes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "filters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      incoming_calls: {
        Row: {
          call_details: Json | null
          callback_number: string | null
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          call_details?: Json | null
          callback_number?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          call_details?: Json | null
          callback_number?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_callback_numbers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_analytics: {
        Row: {
          analytic_id: string
          cost_per_direct_mail: number | null
          cost_per_other: number | null
          cost_per_telemarketed: number | null
          created_at: string | null
          date_snapshot: string
          direct_mail_leads: number | null
          lead_id: string | null
          other_leads: number | null
          telemarketed_leads: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analytic_id?: string
          cost_per_direct_mail?: number | null
          cost_per_other?: number | null
          cost_per_telemarketed?: number | null
          created_at?: string | null
          date_snapshot: string
          direct_mail_leads?: number | null
          lead_id?: string | null
          other_leads?: number | null
          telemarketed_leads?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analytic_id?: string
          cost_per_direct_mail?: number | null
          cost_per_other?: number | null
          cost_per_telemarketed?: number | null
          created_at?: string | null
          date_snapshot?: string
          direct_mail_leads?: number | null
          lead_id?: string | null
          other_leads?: number | null
          telemarketed_leads?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_analytics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_analytics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "lead_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          icon: string
          id: string
          is_default: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          icon: string
          id?: string
          is_default?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          icon?: string
          id?: string
          is_default?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lead_statuses: {
        Row: {
          badge_color_hexcode: string | null
          created_at: string | null
          created_by: string | null
          is_system_default: boolean
          status_id: string
          status_name: string
        }
        Insert: {
          badge_color_hexcode?: string | null
          created_at?: string | null
          created_by?: string | null
          is_system_default?: boolean
          status_id?: string
          status_name: string
        }
        Update: {
          badge_color_hexcode?: string | null
          created_at?: string | null
          created_by?: string | null
          is_system_default?: boolean
          status_id?: string
          status_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_statuses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          attachment: string | null
          date_created: string | null
          date_received: string | null
          id: string
          lead_status_id: string | null
          lead_type: string | null
          quick_note: string | null
          record_day: string | null
          url_link: string | null
          user_id: string | null
        }
        Insert: {
          attachment?: string | null
          date_created?: string | null
          date_received?: string | null
          id?: string
          lead_status_id?: string | null
          lead_type?: string | null
          quick_note?: string | null
          record_day?: string | null
          url_link?: string | null
          user_id?: string | null
        }
        Update: {
          attachment?: string | null
          date_created?: string | null
          date_received?: string | null
          id?: string
          lead_status_id?: string | null
          lead_type?: string | null
          quick_note?: string | null
          record_day?: string | null
          url_link?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_lead_status_id_fkey"
            columns: ["lead_status_id"]
            isOneToOne: false
            referencedRelation: "lead_statuses"
            referencedColumns: ["status_id"]
          },
          {
            foreignKeyName: "leads_lead_type_fkey"
            columns: ["lead_type"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_filters: {
        Row: {
          filters: Json
          id: string
          name: string
          user_id: string
        }
        Insert: {
          filters: Json
          id?: string
          name: string
          user_id: string
        }
        Update: {
          filters?: Json
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_filters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_locations: {
        Row: {
          lead_id: string
          location_id: string
          user_id: string | null
        }
        Insert: {
          lead_id: string
          location_id: string
          user_id?: string | null
        }
        Update: {
          lead_id?: string
          location_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_locations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_locations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "leads_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "leads_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_persons: {
        Row: {
          lead_id: string
          person_id: string
          user_id: string | null
        }
        Insert: {
          lead_id: string
          person_id: string
          user_id?: string | null
        }
        Update: {
          lead_id?: string
          person_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_persons_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_persons_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "leads_persons_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["person_id"]
          },
          {
            foreignKeyName: "leads_persons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string | null
          county: string | null
          county_id: string | null
          lat: number | null
          lng: number | null
          location_id: string
          location_result_type: string | null
          state_code: string | null
          street_address: string | null
          street_address2: string | null
          user_id: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          county?: string | null
          county_id?: string | null
          lat?: number | null
          lng?: number | null
          location_id?: string
          location_result_type?: string | null
          state_code?: string | null
          street_address?: string | null
          street_address2?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          county?: string | null
          county_id?: string | null
          lat?: number | null
          lng?: number | null
          location_id?: string
          location_result_type?: string | null
          state_code?: string | null
          street_address?: string | null
          street_address2?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["county_id"]
          },
          {
            foreignKeyName: "locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string | null
          created_by: string | null
          lead_id: string | null
          note: string
          note_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          lead_id?: string | null
          note: string
          note_id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          lead_id?: string | null
          note?: string
          note_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
        ]
      }
      persons: {
        Row: {
          age: number | null
          called_phone1: number | null
          called_phone2: number | null
          dob: string | null
          email_address: string | null
          first_name: string
          gender: string | null
          last_name: string
          middle_initial: string | null
          person_id: string
          phone1: string | null
          phone2: string | null
          spouse_age: number | null
          spouse_name: string | null
          tobacco_use: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          called_phone1?: number | null
          called_phone2?: number | null
          dob?: string | null
          email_address?: string | null
          first_name: string
          gender?: string | null
          last_name: string
          middle_initial?: string | null
          person_id?: string
          phone1?: string | null
          phone2?: string | null
          spouse_age?: number | null
          spouse_name?: string | null
          tobacco_use?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          called_phone1?: number | null
          called_phone2?: number | null
          dob?: string | null
          email_address?: string | null
          first_name?: string
          gender?: string | null
          last_name?: string
          middle_initial?: string | null
          person_id?: string
          phone1?: string | null
          phone2?: string | null
          spouse_age?: number | null
          spouse_name?: string | null
          tobacco_use?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "persons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_coverage_type: {
        Row: {
          coverage_type_value: string
          id: number
        }
        Insert: {
          coverage_type_value: string
          id?: number
        }
        Update: {
          coverage_type_value?: string
          id?: number
        }
        Relationships: []
      }
      plan_payment_day: {
        Row: {
          day_value: string
          id: number
        }
        Insert: {
          day_value: string
          id?: number
        }
        Update: {
          day_value?: string
          id?: number
        }
        Relationships: []
      }
      plan_payment_method: {
        Row: {
          id: number
          method_value: string
        }
        Insert: {
          id?: number
          method_value: string
        }
        Update: {
          id?: number
          method_value?: string
        }
        Relationships: []
      }
      plan_payment_mode: {
        Row: {
          id: number
          mode_value: string
        }
        Insert: {
          id?: number
          mode_value: string
        }
        Update: {
          id?: number
          mode_value?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          created_at: string | null
          default_payment_method: string | null
          email: string | null
          id: number
          last_payment_attempt_date: string | null
          last_payment_date: string | null
          last_sync: string | null
          metadata: Json | null
          next_payment_due_date: string | null
          payment_amount: number | null
          payment_currency: string | null
          payment_failure_reason: string | null
          payment_status: string | null
          session_data: Json
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          subscription_canceled_date: string | null
          subscription_end_date: string | null
          subscription_plan: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          trial_end_date: string | null
          updated_at: string | null
          user_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_payment_method?: string | null
          email?: string | null
          id?: number
          last_payment_attempt_date?: string | null
          last_payment_date?: string | null
          last_sync?: string | null
          metadata?: Json | null
          next_payment_due_date?: string | null
          payment_amount?: number | null
          payment_currency?: string | null
          payment_failure_reason?: string | null
          payment_status?: string | null
          session_data: Json
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          subscription_canceled_date?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_data: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_payment_method?: string | null
          email?: string | null
          id?: number
          last_payment_attempt_date?: string | null
          last_payment_date?: string | null
          last_sync?: string | null
          metadata?: Json | null
          next_payment_due_date?: string | null
          payment_amount?: number | null
          payment_currency?: string | null
          payment_failure_reason?: string | null
          payment_status?: string | null
          session_data?: Json
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          subscription_canceled_date?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_data?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sat_user_leads_navigator: {
        Row: {
          age: string | null
          called_phone1: number | null
          called_phone2: number | null
          city: string | null
          country: string | null
          date_created: string | null
          email_address: string | null
          file_attachment: string | null
          first_name: string | null
          id: number
          is_migrated: boolean | null
          last_name: string | null
          lat: string | null
          lead_status: string | null
          lead_type: string | null
          lng: string | null
          phone1: string | null
          phone2: string | null
          quick_note: string | null
          record_day: string | null
          spouse_age: string | null
          spouse_name: string | null
          state: string | null
          street_address: string | null
          street_address2: string | null
          url: string | null
          user_id: number | null
          zip: string | null
        }
        Insert: {
          age?: string | null
          called_phone1?: number | null
          called_phone2?: number | null
          city?: string | null
          country?: string | null
          date_created?: string | null
          email_address?: string | null
          file_attachment?: string | null
          first_name?: string | null
          id?: number
          is_migrated?: boolean | null
          last_name?: string | null
          lat?: string | null
          lead_status?: string | null
          lead_type?: string | null
          lng?: string | null
          phone1?: string | null
          phone2?: string | null
          quick_note?: string | null
          record_day?: string | null
          spouse_age?: string | null
          spouse_name?: string | null
          state?: string | null
          street_address?: string | null
          street_address2?: string | null
          url?: string | null
          user_id?: number | null
          zip?: string | null
        }
        Update: {
          age?: string | null
          called_phone1?: number | null
          called_phone2?: number | null
          city?: string | null
          country?: string | null
          date_created?: string | null
          email_address?: string | null
          file_attachment?: string | null
          first_name?: string | null
          id?: number
          is_migrated?: boolean | null
          last_name?: string | null
          lat?: string | null
          lead_status?: string | null
          lead_type?: string | null
          lng?: string | null
          phone1?: string | null
          phone2?: string | null
          quick_note?: string | null
          record_day?: string | null
          spouse_age?: string | null
          spouse_name?: string | null
          state?: string | null
          street_address?: string | null
          street_address2?: string | null
          url?: string | null
          user_id?: number | null
          zip?: string | null
        }
        Relationships: []
      }
      sat_users: {
        Row: {
          email: string | null
          id: number
          name: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      task_statuses: {
        Row: {
          badge_color_hexcode: string | null
          created_at: string | null
          created_by: string | null
          status_id: string
          status_name: string
        }
        Insert: {
          badge_color_hexcode?: string | null
          created_at?: string | null
          created_by?: string | null
          status_id?: string
          status_name: string
        }
        Update: {
          badge_color_hexcode?: string | null
          created_at?: string | null
          created_by?: string | null
          status_id?: string
          status_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_statuses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          application_id: string | null
          assigned_to: string | null
          created_at: string | null
          due_date: string
          lead_id: string | null
          task_description: string
          task_id: string
          task_status_id: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          due_date: string
          lead_id?: string | null
          task_description: string
          task_id?: string
          task_status_id?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          due_date?: string
          lead_id?: string | null
          task_description?: string
          task_id?: string
          task_status_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "search_leads"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "tasks_task_status_id_fkey"
            columns: ["task_status_id"]
            isOneToOne: false
            referencedRelation: "task_statuses"
            referencedColumns: ["status_id"]
          },
        ]
      }
      team: {
        Row: {
          created_at: string
          email: string | null
          id: number
          permissions: Json | null
          phone_number: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          permissions?: Json | null
          phone_number?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          permissions?: Json | null
          phone_number?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      twilio_subaccounts: {
        Row: {
          account_sid: string
          api_key: Json | null
          auth_token: string
          date_created: string | null
          date_updated: string | null
          friendly_name: string | null
          id: number
          owner_account_sid: string | null
          status: string | null
          subresource_uris: Json | null
          twiml_application: Json | null
          type: string | null
          uri: string | null
          user_id: string
        }
        Insert: {
          account_sid: string
          api_key?: Json | null
          auth_token: string
          date_created?: string | null
          date_updated?: string | null
          friendly_name?: string | null
          id?: number
          owner_account_sid?: string | null
          status?: string | null
          subresource_uris?: Json | null
          twiml_application?: Json | null
          type?: string | null
          uri?: string | null
          user_id: string
        }
        Update: {
          account_sid?: string
          api_key?: Json | null
          auth_token?: string
          date_created?: string | null
          date_updated?: string | null
          friendly_name?: string | null
          id?: number
          owner_account_sid?: string | null
          status?: string | null
          subresource_uris?: Json | null
          twiml_application?: Json | null
          type?: string | null
          uri?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "twilio_subaccounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      upload_runs: {
        Row: {
          duplicates_found: number | null
          error_message: string | null
          file_path: string | null
          leads_processed: number | null
          status: string | null
          timestamp: string | null
          updated_at: string | null
          upload_run_id: number
          user_id: string | null
        }
        Insert: {
          duplicates_found?: number | null
          error_message?: string | null
          file_path?: string | null
          leads_processed?: number | null
          status?: string | null
          timestamp?: string | null
          updated_at?: string | null
          upload_run_id?: number
          user_id?: string | null
        }
        Update: {
          duplicates_found?: number | null
          error_message?: string | null
          file_path?: string | null
          leads_processed?: number | null
          status?: string | null
          timestamp?: string | null
          updated_at?: string | null
          upload_run_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upload_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      search_leads: {
        Row: {
          fts: unknown | null
          lead_id: string | null
          location_details: string[] | null
          person_details: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_search_leads: {
        Args: Record<PropertyKey, never>
        Returns: unknown[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

