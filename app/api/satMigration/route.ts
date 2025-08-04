import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
      
  try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser.user) {
        return NextResponse.json<JsonBodyError>({
          error: 'Unauthorized',
          message: 'Unauthorized',
        }, { status: 401 });
      }

      /**
       * @todo - create indexing to `email` and `user_id`
       */
      const { data: satUser, error: satUserError  } = await supabase.from('sat_users').select('*').eq('email', authUser.user.email!).single();

      if (satUserError || !satUser) {
        return NextResponse.json<JsonBodyError>({
          error: 'NotFound',
          message: 'User not found',
        }, { status: 404 });
      }

      const batchSize = 1000;
      let offset = 0;
      let allSatUserLeads: SATLead[] = [];

      while (true) {
        const { data: batchSatUserLeads, error: batchError } = await supabase
          .from('sat_user_leads_navigator')
          .select('*')
          .eq('user_id', satUser.id)
          .eq('is_migrated', false)
          .range(offset, offset + batchSize - 1)
          
        if(batchError || !batchSatUserLeads) {
          return NextResponse.json<JsonBodyError>({
            error: 'NotFound',
            message: 'User leads not found',
          }, { status: 404 });
        }

        if (batchSatUserLeads.length === 0) {
          for (const lead of allSatUserLeads) {
            // Leads Table
            const migrateLead: Lead = {
              user_id: authUser.user.id,
              record_day: lead.record_day ? new Date(lead.record_day).toISOString() : null,
              lead_status_id: lead.lead_status ? await mapLeadStatus(lead.lead_status, authUser.user.id) : null,
              lead_type: lead.lead_type ? await mapLeadType(lead.lead_type, authUser.user.id) : null,
              quick_note: lead.quick_note,
              attachment: lead.file_attachment,
              url_link: lead.url,
              date_created: lead.date_created ? new Date(lead.date_created).toISOString() : null,
              date_received: new Date().toISOString()
            };

           // Locations Table
           const migrateLocation: LeadLocation = {
              user_id: authUser.user.id,
              street_address: lead.street_address,
              street_address2: lead.street_address2,
              city: lead.city,
              state_code: lead.state,
              zip: lead.zip,
              county: lead.country,
              lat: lead.lat ? Number(lead.lat) : null,
              lng: lead.lng ? Number(lead.lng) : null,
           }

           // Peson Table
           const migratePerson: LeadPerson = {
            user_id: authUser.user.id,
            first_name: lead.first_name ?? '',
            last_name: lead.last_name ?? '',
            email_address: lead.email_address ?? '',
            phone1: lead.phone1 ?? '',
            phone2: lead.phone2 ?? '',
            age: lead.age ? Number(lead.age) : null,
            called_phone1: lead.called_phone1 ?? 0,
            called_phone2: lead.called_phone2 ?? 0,
            spouse_age: lead.spouse_age ? Number(lead.spouse_age) : null,
            spouse_name: lead.spouse_name
           }

           const [locationData, leadData, personData] = await Promise.all([
            supabase.from('locations').insert(migrateLocation).select('location_id').single(),
            supabase.from('leads').insert(migrateLead).select('id').single(),
            supabase.from('persons').insert(migratePerson).select('person_id').single(),
            supabase.from('sat_user_leads_navigator').update({ is_migrated: true }).eq('id', lead.id)
           ]);
           
           if (locationData.data && leadData.data && personData.data) {
            await Promise.all([
              supabase.from('leads_persons').insert({
                lead_id: leadData?.data?.id,
                person_id: personData?.data?.person_id!,
                user_id: authUser.user.id
              }),
              supabase.from('leads_locations').insert({
                lead_id: leadData?.data?.id!,
                location_id: locationData?.data?.location_id!,
                user_id: authUser.user.id
              })
            ])
           }

          } 
          
          return NextResponse.json<JsonBodySuccess<unknown>>({
            success: true,
            data: null
          }, { status: 200 });
        }

        allSatUserLeads = allSatUserLeads.concat(batchSatUserLeads);
        offset += batchSize;
      }
  } catch (e) {
    const error = e as Error
    return NextResponse.json<JsonBodyError>({
      error: 'InternalServerError',
      message: error.message
    }, { status: 500 });
  }


  async function mapLeadStatus(leadStatus: string, authUserId: string) {
    const { data: leadStatusData } = await supabase.from('lead_statuses').select('status_id').eq('status_name', leadStatus?.trim()).or(`is_system_default.is.TRUE,created_by.eq.${authUserId}`).single();
    if (leadStatusData) {
      return leadStatusData.status_id;
    } 
    
    const { data: newLeadStatusData, error: newLeadStatusError } = await supabase.from('lead_statuses').insert({
            status_name: leadStatus,
            created_by: authUserId,
            created_at: new Date().toISOString(),
            badge_color_hexcode: generateBadgeColor()
          }).select('status_id').single();

    if (newLeadStatusError) throw new Error('Failed to create new lead status.');

    return newLeadStatusData?.status_id;
  }

  async function mapLeadType(leadType: string, authUserId: string) {
    const { data: leadTypeData } = await supabase.from('lead_sources').select('id').eq('name', leadType?.trim()).or(`is_default.is.TRUE,user_id.eq.${authUserId}`).single();

    if (leadTypeData) {
      return leadTypeData.id;
    }

    const { data: newLeadTypeData, error: newLeadTypeError } = await supabase.from('lead_sources').insert({
      name: leadType,
      user_id: authUserId,
      icon: '',
    }).select('id').single();

    if (newLeadTypeError) throw new Error('Failed to create new lead type.');

    return newLeadTypeData?.id;
  } 
}

const generateBadgeColor = (function() {
  const colors = ['#c2e3c1', '#b5dbc9', '#7fc7b6', '#b6dcdc', '#acc3c3', '#729aac', '#ebc2bf', '#e6848f', '#c05965'];
  let colorIndex = 0;

  return function() {
    const badgeColorHexcode = colors[colorIndex++ % colors.length];
    return badgeColorHexcode;
  };
})();

