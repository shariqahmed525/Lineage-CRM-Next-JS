import type { Database as DB } from '@/types/database.types'

declare global {
  // Database
  type Database = DB
  type Appointment = DB['public']['Tables']['appointments']['Row']
  type SATLead = DB['public']['Tables']['sat_user_leads_navigator']['Row']
  type Lead = Omit<DB['public']['Tables']['leads']['Row'], 'id'>
  type LeadLocation = Omit<DB['public']['Tables']['locations']['Row'], 'location_id' | 'county_id' | 'location_result_type'>
  type LeadPerson = Omit<DB['public']['Tables']['persons']['Row'], 'person_id'>

  // API
  type JsonBodyError = {
    error: 'Unauthorized' | 'BadRequest' | 'InternalServerError' | 'NotFound',
    message?: string
  }

  type JsonBodySuccess<T> = {
    success: boolean,
    data: T | T[]
  }
}