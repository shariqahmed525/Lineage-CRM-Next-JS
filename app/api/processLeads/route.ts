// app/api/processLeads/route.ts
import { parseISO, isValid } from 'date-fns';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import Papa from 'papaparse';

import { createSupabaseClient } from '@/utils/supabase/server';

import { Lead } from '../../../types/databaseTypes';


interface UploadRun {
  upload_run_id: number;
  user_id: string;
  file_path: string;
  leads_processed: number;
  duplicates_found: number;
  status: string;
  timestamp: string;
  error_message?: string;
}

const isValidLead = (record: any): record is Lead => {
  // Adjust the property names to match the keys used in the mappedRecord
  return record['person.first_name'] && record['person.phone1'];
}

const isDuplicate = async (record: any, supabase: any): Promise<{ lead_id: string, person_id: string, first_name: string, last_name: string, phone1: string } | null> => {
  // Normalize input data
  const firstName = record['person.first_name']?.trim().toLowerCase();
  const lastName = record['person.last_name']?.trim().toLowerCase();
  const phone1 = record['person.phone1']?.trim();

  const { data: existingPersons, error } = await supabase
    .from('persons')
    .select('person_id, first_name, last_name, phone1, leads(id)')
    .ilike('first_name', firstName)
    .ilike('last_name', lastName)
    .eq('phone1', phone1);

  if (error) {
    console.error('Error checking for duplicates:', error);
    throw error;
  }

  console.log('Current Person:', record);
  console.log('Existing Persons:', existingPersons);
  console.log(`
  _______  _______  _______  _______  _______  _______  _______  _______ 
 (  ____ \\(  ___  )(       )(  ____ \\(  ____ \\(  ____ \\(  ____ \\(  ____ \\
 | (    \\/| (   ) || () () || (    \\/| (    \\/| (    \\/| (    \\/| (    \\/
 | (__    | (___) || || || || (__    | |      | (__    | (__    | (_____ 
 |  __)   |  ___  || |(_)| ||  __)   | | ____ |  __)   |  __)   (_____  )
 | (      | (   ) || |   | || (      | | \\_  )| (      | (            ) |
 | (____/\\| )   ( || )   ( || (____/\\| (___) || (____/\\| (____/\\/\\____) |
 (_______/|/     \\||/     \\|(_______/(_______)(_______/(_______/\\_______)
`);

  // Check if any of the existing persons have associated leads
  const duplicate = existingPersons?.find(person => person.leads?.length > 0);

  if (duplicate) {
    return {
      lead_id: duplicate.leads[0]?.id, // Using optional chaining
      person_id: duplicate.person_id,
      first_name: duplicate.first_name,
      last_name: duplicate.last_name,
      phone1: duplicate.phone1,
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Authorization failed:', userError);
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const body = await request.json();
  const { filePath, headerMapping } = body;

  if (!headerMapping || !Array.isArray(headerMapping)) {
    console.error('Header mapping is invalid:', headerMapping);
    return new NextResponse(JSON.stringify({ error: 'Invalid header mapping.' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { data: uploadRun, error: uploadRunError } = await supabase
    .from('upload_runs')
    .insert([{
      user_id: user.user.id,
      file_path: filePath,
      leads_processed: 0,
      duplicates_found: 0,
      status: 'partial',
      timestamp: new Date().toISOString(),
      error_message: '',
    }])
    .select()
    .single();

  if (uploadRunError || !uploadRun) {
    console.error('Failed to create upload run:', uploadRunError);
    return new NextResponse(JSON.stringify({ error: 'Failed to create upload run.', details: uploadRunError }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { data: downloadData, error: downloadError } = await supabase.storage.from('lead-uploads').download(filePath);

    if (downloadError) {
      console.error('Failed to download file:', downloadError);
      throw new Error('Failed to download file.');
    }

    const text = await downloadData.text();
    const parsedData = Papa.parse(text, { header: true });

    const leads = [];
    const duplicates = [];
    const leadsAdded = [];
    const leadsSkipped = [];

    const mapHeaders = (record) => {
      const mappedRecord = {};
      headerMapping.forEach(({ header, databaseColumn }) => {
        mappedRecord[databaseColumn] = record[header];
      });
      return mappedRecord;
    };

    for (const record of parsedData.data) {
      try {
        const mappedRecord = mapHeaders(record);

        if (!isValidLead(mappedRecord)) {
          console.log('Skipping lead due to validation failure:', mappedRecord);
          leadsSkipped.push(mappedRecord);
          continue;
        }

        const duplicate = await isDuplicate(mappedRecord, supabase);
        if (duplicate) {
          console.log('Found duplicate:', duplicate);
          duplicates.push({
            duplicate_lead_id: duplicate.lead_id,
            duplicate_info: duplicate,
            attempted_lead_info: mappedRecord,
          });
          await supabase
            .from('duplicates')
            .insert([{
              upload_run_id: uploadRun.upload_run_id,
              existing_lead_id: duplicate.lead_id,
              duplicate_data: mappedRecord,
            }]);
          continue;
        }

        if (mappedRecord['lead.date_received']) {
          const parsedDate = parseISO(mappedRecord['lead.date_received']);
          if (!isValid(parsedDate)) {
            console.log('Skipping lead due to invalid date format:', mappedRecord);
            leadsSkipped.push(mappedRecord);
            continue;
          }
          mappedRecord['lead.date_received'] = parsedDate.toISOString();
        }

        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .insert([{
            date_received: mappedRecord['lead.date_received'] ? mappedRecord['lead.date_received'] : null,
            lead_type: mappedRecord['lead.lead_type'],
            quick_note: mappedRecord['lead.quick_note'],
            record_day: mappedRecord['lead.record_day'],
            user_id: user.user.id,
            lead_status_id: mappedRecord['lead.lead_status_id'],
          }])
          .select()
          .single();

        if (leadError) {
          console.error('Error creating lead:', leadError, 'Record:', mappedRecord);
          leadsSkipped.push(mappedRecord);
          continue;
        }

        const { data: locationData, error: locationError } = await supabase
          .from('locations')
          .insert([{
            street_address: mappedRecord['location.street_address'],
            city: mappedRecord['location.city'],
            state_code: mappedRecord['location.state_code'],
            zip: mappedRecord['location.zip'],
            user_id: user.user.id,
          }])
          .select()
          .single();

        if (locationError) {
          console.error('Error creating location:', locationError, 'Record:', mappedRecord);
          leadsSkipped.push(mappedRecord);
          continue;
        }

        const { error: leadLocationError } = await supabase
          .from('leads_locations')
          .insert([{
            lead_id: leadData.id,
            location_id: locationData.location_id,
            user_id: user.user.id,
          }]);

        if (leadLocationError) {
          console.error('Error linking lead and location:', leadLocationError, 'Record:', mappedRecord);
          leadsSkipped.push(mappedRecord);
          continue;
        }

        const { data: personData, error: personError } = await supabase
          .from('persons')
          .insert([{
            first_name: mappedRecord['person.first_name'],
            last_name: mappedRecord['person.last_name'],
            spouse_name: mappedRecord['person.spouse_name'],
            email_address: mappedRecord['person.email_address'],
            phone1: mappedRecord['person.phone1'],
            phone2: mappedRecord['person.phone2'],
            user_id: user.user.id,
          }])
          .select()
          .single();

        if (personError) {
          console.error('Error creating person:', personError, 'Record:', mappedRecord);
          leadsSkipped.push(mappedRecord);
          continue;
        }

        const { error: leadPersonError } = await supabase
          .from('leads_persons')
          .insert([{
            lead_id: leadData.id,
            person_id: personData.person_id,
            user_id: user.user.id,
          }]);

        if (leadPersonError) {
          console.error('Error linking lead and person:', leadPersonError, 'Record:', mappedRecord);
          leadsSkipped.push(mappedRecord);
          continue;
        }

        leads.push(mappedRecord);
        leadsAdded.push(mappedRecord);
      } catch (error) {
        console.error('Error processing lead:', error, 'Record:', record);
        leadsSkipped.push(record);
      }
    }

    await supabase
      .from('upload_runs')
      .update({
        leads_processed: leads.length,
        duplicates_found: duplicates.length,
        status: 'success',
        error_message: null,
      })
      .eq('upload_run_id', uploadRun.upload_run_id);

    return new NextResponse(JSON.stringify({
      duplicates,
      leadsAdded,
      leadsSkipped,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Overall error in processing leads:', error);
    await supabase
      .from('upload_runs')
      .update({ error_message: (error as Error).message, status: 'failed' })
      .eq('upload_run_id', uploadRun.upload_run_id);

    return new NextResponse(JSON.stringify({ error: 'Failed to process leads.', details: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
