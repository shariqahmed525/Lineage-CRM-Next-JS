/**
 * This endpoint seeds user data for a staging environment.
 * It uses Supabase Auth to get the user information and then uses the service key
 * to insert predefined data into various tables in the database.
 *
 * Usage:
 * - This endpoint can be called from the frontend to seed data for a user in a staging environment.
 * - It expects a POST request and uses the authenticated user's ID to associate the data.
 */

import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export const POST = async (request: NextRequest) => {
  console.log('Request', JSON.stringify(request, null, 2));
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  // Retrieve the  user from the Supabase auth session
  let user, userError;
  try {
    const { data, error } = await supabase.auth.getUser();
    user = data;
    userError = error;
  } catch (error) {
    console.log('Error in seed data request', JSON.stringify(error, null, 2));

    console.error('Error parsing Supabase cookie:', error);
    return new NextResponse(JSON.stringify({ error: 'Invalid cookie format' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (userError || !user) {
    console.log('Error in SeedUserData Route', userError?.message, user?.user);
    return new NextResponse(JSON.stringify({ error: 'Unauthorized', message: userError?.toString() }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const userId = user?.user?.id;

  try {
    // Step 1: Create Lead Statuses
    await supabase.from('lead_statuses').insert([
      { status_name: 'New', created_by: userId, badge_color_hexcode: '#c05965' },
      { status_name: 'Contacted', created_by: userId, badge_color_hexcode: '#e6848f' },
      { status_name: 'Qualified', created_by: userId, badge_color_hexcode: '#b5dbc9' },
      { status_name: 'Proposal Sent', created_by: userId, badge_color_hexcode: '#7fc7b6' },
      { status_name: 'Negotiation', created_by: userId, badge_color_hexcode: '#729aac' },
      { status_name: 'Closed Won', created_by: userId, badge_color_hexcode: '#b6dcdc' },
      { status_name: 'Closed Lost', created_by: userId, badge_color_hexcode: '#acc3c3' },
    ]);

    // Step 2: Create Locations
    await supabase.from('locations').insert([
      {
        street_address: '308 Negra Arroyo Lane', city: 'Albuquerque', state_code: 'NM', zip: '87104', county_id: null, lat: 35.1264, lng: -106.5367, user_id: userId,
      },
      {
        street_address: '4901 Cumbre Del Sur Ct NE', city: 'Albuquerque', state_code: 'NM', zip: '87111', county_id: null, lat: 35.1446, lng: -106.4816, user_id: userId,
      },
      {
        street_address: '3828 Piermont Dr NE', city: 'Albuquerque', state_code: 'NM', zip: '87111', county_id: null, lat: 35.1357, lng: -106.5202, user_id: userId,
      },
      {
        street_address: '308 Enchanted Pkwy', city: 'Albuquerque', state_code: 'NM', zip: '87114', county_id: null, lat: 35.2001, lng: -106.6675, user_id: userId,
      },
      {
        street_address: '1601 San Pedro Dr SE', city: 'Albuquerque', state_code: 'NM', zip: '87108', county_id: null, lat: 35.0736, lng: -106.5822, user_id: userId,
      },
      {
        street_address: '1213 Jefferson St NE', city: 'Albuquerque', state_code: 'NM', zip: '87110', county_id: null, lat: 35.1045, lng: -106.6205, user_id: userId,
      },
      {
        street_address: '4501 Montgomery Blvd NE', city: 'Albuquerque', state_code: 'NM', zip: '87109', county_id: null, lat: 35.1263, lng: -106.6015, user_id: userId,
      },
      {
        street_address: '1234 Main St', city: 'Albuquerque', state_code: 'NM', zip: '87102', county_id: null, lat: 35.0844, lng: -106.6504, user_id: userId,
      },
      {
        street_address: '5678 Elm St', city: 'Albuquerque', state_code: 'NM', zip: '87105', county_id: null, lat: 35.0735, lng: -106.6782, user_id: userId,
      },
      {
        street_address: '9101 Oak St', city: 'Albuquerque', state_code: 'NM', zip: '87106', county_id: null, lat: 35.0833, lng: -106.6175, user_id: userId,
      },
      {
        street_address: '1122 Maple St', city: 'Albuquerque', state_code: 'NM', zip: '87107', county_id: null, lat: 35.1097, lng: -106.6425, user_id: userId,
      },
      {
        street_address: '3344 Pine St', city: 'Albuquerque', state_code: 'NM', zip: '87108', county_id: null, lat: 35.0736, lng: -106.5822, user_id: userId,
      },
      {
        street_address: '5566 Cedar St', city: 'Albuquerque', state_code: 'NM', zip: '87109', county_id: null, lat: 35.1263, lng: -106.6015, user_id: userId,
      },
      {
        street_address: '7788 Birch St', city: 'Albuquerque', state_code: 'NM', zip: '87110', county_id: null, lat: 35.1045, lng: -106.6205, user_id: userId,
      },
      {
        street_address: '9900 Spruce St', city: 'Albuquerque', state_code: 'NM', zip: '87111', county_id: null, lat: 35.1446, lng: -106.4816, user_id: userId,
      },
    ]);

    // Step 3: Create Persons
    await supabase.from('persons').insert([
      {
        first_name: 'Walter', last_name: 'White', email_address: 'walter.white@breakingbad.com', phone1: '505-123-4567', user_id: userId,
      },
      {
        first_name: 'Skyler', last_name: 'White', email_address: 'skyler.white@breakingbad.com', phone1: '505-234-5678', user_id: userId,
      },
      {
        first_name: 'Jesse', last_name: 'Pinkman', email_address: 'jesse.pinkman@breakingbad.com', phone1: '505-345-6789', user_id: userId,
      },
      {
        first_name: 'Hank', last_name: 'Schrader', email_address: 'hank.schrader@breakingbad.com', phone1: '505-456-7890', user_id: userId,
      },
      {
        first_name: 'Marie', last_name: 'Schrader', email_address: 'marie.schrader@breakingbad.com', phone1: '505-567-8901', user_id: userId,
      },
      {
        first_name: 'Saul', last_name: 'Goodman', email_address: 'saul.goodman@breakingbad.com', phone1: '505-678-9012', user_id: userId,
      },
      {
        first_name: 'Gustavo', last_name: 'Fring', email_address: 'gustavo.fring@breakingbad.com', phone1: '505-789-0123', user_id: userId,
      },
      {
        first_name: 'Mike', last_name: 'Ehrmantraut', email_address: 'mike.ehrmantraut@breakingbad.com', phone1: '505-890-1234', user_id: userId,
      },
      {
        first_name: 'Lydia', last_name: 'Rodarte-Quayle', email_address: 'lydia.rodarte-quayle@breakingbad.com', phone1: '505-901-2345', user_id: userId,
      },
      {
        first_name: 'Todd', last_name: 'Alquist', email_address: 'todd.alquist@breakingbad.com', phone1: '505-012-3456', user_id: userId,
      },
      {
        first_name: 'Jane', last_name: 'Margolis', email_address: 'jane.margolis@breakingbad.com', phone1: '505-123-4568', user_id: userId,
      },
      {
        first_name: 'Tuco', last_name: 'Salamanca', email_address: 'tuco.salamanca@breakingbad.com', phone1: '505-234-5679', user_id: userId,
      },
      {
        first_name: 'Hector', last_name: 'Salamanca', email_address: 'hector.salamanca@breakingbad.com', phone1: '505-345-6780', user_id: userId,
      },
      {
        first_name: 'Gale', last_name: 'Boetticher', email_address: 'gale.boetticher@breakingbad.com', phone1: '505-456-7891', user_id: userId,
      },
      {
        first_name: 'Andrea', last_name: 'Cantillo', email_address: 'andrea.cantillo@breakingbad.com', phone1: '505-567-8902', user_id: userId,
      },
    ]);

    // Step 4: Create Leads
    await supabase.from('leads').insert([
      {
        user_id: userId, lead_status_id: (await supabase.from('lead_statuses').select('status_id').eq('status_name', 'New').single()).data?.status_id, lead_type: 'Individual', quick_note: 'Potential client interested in end-of-life insurance.', lead_source_id: null,
      },
      {
        user_id: userId, lead_status_id: (await supabase.from('lead_statuses').select('status_id').eq('status_name', 'Contacted').single()).data?.status_id, lead_type: 'Individual', quick_note: 'Follow-up needed for insurance policy.', lead_source_id: null,
      },
      {
        user_id: userId, lead_status_id: (await supabase.from('lead_statuses').select('status_id').eq('status_name', 'Qualified').single()).data?.status_id, lead_type: 'Individual', quick_note: 'Qualified lead for insurance policy.', lead_source_id: null,
      },
      {
        user_id: userId, lead_status_id: (await supabase.from('lead_statuses').select('status_id').eq('status_name', 'Proposal Sent').single()).data?.status_id, lead_type: 'Individual', quick_note: 'Proposal sent for insurance policy.', lead_source_id: null,
      },
      {
        user_id: userId, lead_status_id: (await supabase.from('lead_statuses').select('status_id').eq('status_name', 'Negotiation').single()).data?.status_id, lead_type: 'Individual', quick_note: 'Negotiation in progress for insurance policy.', lead_source_id: null,
      },
      {
        user_id: userId, lead_status_id: (await supabase.from('lead_statuses').select('status_id').eq('status_name', 'Closed Won').single()).data?.status_id, lead_type: 'Individual', quick_note: 'Insurance policy closed won.', lead_source_id: null,
      },
      {
        user_id: userId, lead_status_id: (await supabase.from('lead_statuses').select('status_id').eq('status_name', 'Closed Lost').single()).data?.status_id, lead_type: 'Individual', quick_note: 'Insurance policy closed lost.', lead_source_id: null,
      },
    ]);

    // Step 5: Create Leads_Persons
    await supabase.from('leads_persons').insert([
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Potential client interested in end-of-life insurance.').single())?.data?.id,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Walter').eq('last_name', 'White')
          .single())?.data?.person_id,
        user_id: userId,
      },
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Follow-up needed for insurance policy.').single())?.data?.id,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Skyler').eq('last_name', 'White')
          .single())?.data?.person_id,
        user_id: userId,
      },
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Qualified lead for insurance policy.').single())?.data?.id,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Jesse').eq('last_name', 'Pinkman')
          .single())?.data?.person_id,
        user_id: userId,
      },
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Proposal sent for insurance policy.').single())?.data?.id,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Hank').eq('last_name', 'Schrader')
          .single())?.data?.person_id,
        user_id: userId,
      },
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Negotiation in progress for insurance policy.').single())?.data?.id,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Marie').eq('last_name', 'Schrader')
          .single())?.data?.person_id,
        user_id: userId,
      },
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Insurance policy closed won.').single())?.data?.id,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Saul').eq('last_name', 'Goodman')
          .single())?.data?.person_id,
        user_id: userId,
      },
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Insurance policy closed lost.').single())?.data?.id,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Gustavo').eq('last_name', 'Fring')
          .single())?.data?.person_id,
        user_id: userId,
      },
    ]);

    // Step 6: Create Leads_Locations
    await supabase.from('leads_locations').insert([
      { lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Potential client interested in end-of-life insurance.').single())?.data?.id, location_id: (await supabase.from('locations').select('location_id').eq('street_address', '308 Negra Arroyo Lane').single())?.data?.location_id, user_id: userId },
      { lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Follow-up needed for insurance policy.').single())?.data?.id, location_id: (await supabase.from('locations').select('location_id').eq('street_address', '4901 Cumbre Del Sur Ct NE').single())?.data?.location_id, user_id: userId },
      { lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Qualified lead for insurance policy.').single())?.data?.id, location_id: (await supabase.from('locations').select('location_id').eq('street_address', '3828 Piermont Dr NE').single())?.data?.location_id, user_id: userId },
      { lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Proposal sent for insurance policy.').single())?.data?.id, location_id: (await supabase.from('locations').select('location_id').eq('street_address', '308 Enchanted Pkwy').single())?.data?.location_id, user_id: userId },
      { lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Negotiation in progress for insurance policy.').single())?.data?.id, location_id: (await supabase.from('locations').select('location_id').eq('street_address', '1601 San Pedro Dr SE').single())?.data?.location_id, user_id: userId },
      { lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Insurance policy closed won.').single())?.data?.id, location_id: (await supabase.from('locations').select('location_id').eq('street_address', '1213 Jefferson St NE').single())?.data?.location_id, user_id: userId },
      { lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Insurance policy closed lost.').single())?.data?.id, location_id: (await supabase.from('locations').select('location_id').eq('street_address', '4501 Montgomery Blvd NE').single())?.data?.location_id, user_id: userId },
    ]);

    // Step 7: Create Activities
    await supabase.from('activity').insert([
      {
        activity_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Potential client interested in end-of-life insurance.').single())?.data?.id, action_type: 'Call', action_date: new Date().toISOString(), created_by: userId, note: 'Called Walter White to discuss insurance options.',
      },
      {
        activity_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Follow-up needed for insurance policy.').single())?.data?.id, action_type: 'Email', action_date: new Date().toISOString(), created_by: userId, note: 'Sent follow-up email to Skyler White.',
      },
      {
        activity_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Qualified lead for insurance policy.').single())?.data?.id, action_type: 'Meeting', action_date: new Date().toISOString(), created_by: userId, note: 'Met with Jesse Pinkman to discuss policy details.',
      },
      {
        activity_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Proposal sent for insurance policy.').single())?.data?.id, action_type: 'Call', action_date: new Date().toISOString(), created_by: userId, note: 'Called Hank Schrader to discuss proposal.',
      },
      {
        activity_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Negotiation in progress for insurance policy.').single())?.data?.id, action_type: 'Email', action_date: new Date().toISOString(), created_by: userId, note: 'Sent negotiation email to Marie Schrader.',
      },
      {
        activity_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Insurance policy closed won.').single())?.data?.id, action_type: 'Meeting', action_date: new Date().toISOString(), created_by: userId, note: 'Met with Saul Goodman to finalize policy.',
      },
      {
        activity_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Insurance policy closed lost.').single())?.data?.id, action_type: 'Call', action_date: new Date().toISOString(), created_by: userId, note: 'Called Gustavo Fring to discuss lost policy.',
      },
    ]);

    // Step 8: Create Notes
    await supabase.from('notes').insert([
      {
        note_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Potential client interested in end-of-life insurance.').single())?.data?.id, note: 'Walter White is interested in a comprehensive end-of-life insurance policy.', created_by: userId,
      },
      {
        note_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Follow-up needed for insurance policy.').single())?.data?.id, note: 'Skyler White needs a follow-up call regarding her policy.', created_by: userId,
      },
      {
        note_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Qualified lead for insurance policy.').single())?.data?.id, note: 'Jesse Pinkman is a qualified lead for a new policy.', created_by: userId,
      },
      {
        note_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Proposal sent for insurance policy.').single())?.data?.id, note: 'Proposal sent to Hank Schrader for review.', created_by: userId,
      },
      {
        note_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Negotiation in progress for insurance policy.').single())?.data?.id, note: 'Negotiation ongoing with Marie Schrader.', created_by: userId,
      },
      {
        note_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Insurance policy closed won.').single()).data?.id, note: 'Policy closed won with Saul Goodman.', created_by: userId,
      },
      {
        note_id: null, lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Insurance policy closed lost.').single())?.data?.id, note: 'Policy closed lost with Gustavo Fring.', created_by: userId,
      },
    ]);

    // Step 9: Create Carriers
    await supabase.from('carriers').insert([
      {
        carrier_name: 'Los Pollos Hermanos Insurance',
        parent_code: 'LPH001',
        logo_url: 'https://example.com/lph_logo.png',
        website: 'https://lospolloshermanos.com',
        user_id: userId,
      },
      {
        carrier_name: 'Vamonos Pest Insurance',
        parent_code: 'VP001',
        logo_url: 'https://example.com/vp_logo.png',
        website: 'https://vamonospest.com',
        user_id: userId,
      },
    ]);

    // Step 10: Create Carrier Plans
    await supabase.from('carrier_plans').insert([
      {
        carrier_id: (await supabase.from('carriers').select('carrier_id').eq('carrier_name', 'Los Pollos Hermanos Insurance').single())?.data?.carrier_id,
        status_id: null,
        plan_name: 'Blue Sky Premium Plan',
        user_id: userId,
        plan_code: 'BSP001',
        default_commission_rate: 0.15,
        parent_code: 'BSP',
      },
      {
        carrier_id: (await supabase.from('carriers').select('carrier_id').eq('carrier_name', 'Vamonos Pest Insurance').single())?.data?.carrier_id,
        status_id: null,
        plan_name: 'Bug Out Basic Plan',
        user_id: userId,
        plan_code: 'BOB001',
        default_commission_rate: 0.10,
        parent_code: 'BOB',
      },
    ]);

    // Step 11: Create Applications
    await supabase.from('applications').insert([
      {
        application_id: null,
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Potential client interested in end-of-life insurance.').single())?.data?.id,
        application_date: '2023-01-01',
        status: 1,
        policy_number: 'POL123456',
        plan_id: (await supabase.from('carrier_plans').select('plan_id').eq('plan_name', 'Blue Sky Premium Plan').single())?.data?.plan_id,
        coverage_type: 1,
        face_amount: 100000,
        monthly_premium: 100,
        payment_mode: 1,
        payment_method: 1,
        payment_day: 1,
        effective_date: '2023-02-01',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        additional_notes: 'First application for Walter White.',
        user_id: userId,
        replacing_existing_coverage: false,
        effective_first_draft_date: '2023-01-15',
        replaced_policy_number: 'REP123456',
        replaced_face_amount: '50000',
        replaced_coverage_type: 'Type A',
        replaced_premium_amount: '50',
        replaced_has_bank_draft_been_stopped: false,
        carrier_1: (await supabase.from('carriers').select('carrier_id').eq('carrier_name', 'Los Pollos Hermanos Insurance').single()).data?.carrier_id,
        carrier_2: null,
        replaced_carrier_1: null,
        replaced_carrier_2: null,
        carrier_plan_1: (await supabase.from('carrier_plans').select('plan_id').eq('plan_name', 'Blue Sky Premium Plan').single())?.data?.plan_id,
        carrier_plan_2: null,
        has_bank_draft_been_stopped: false,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Walter').eq('last_name', 'White')
          .single())?.data?.person_id,
        age_on_effective_date: 50,
        age_on_replacement_date: '2023-12-31 00:00:00+00',
        cancel_or_cash_in_date: '2023-12-31',
        middle_initial: 'H',
        gender: 'Male',
        tobacco_use: 'No',
        commission_rate: 0.1,
        first_name: 'Walter',
        last_name: 'White',
        street_address: '308 Negra Arroyo Lane',
        street_address2: '',
        city: 'Albuquerque',
        state_code: 'NM',
        zip: '87104',
        county_id: null,
        phone1: '505-123-4567',
        dob: '1960-09-07',
      },
      {
        application_id: null,
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Follow-up needed for insurance policy.').single())?.data?.id,
        application_date: '2023-01-02',
        status: 2,
        policy_number: 'POL123457',
        plan_id: (await supabase.from('carrier_plans').select('plan_id').eq('plan_name', 'Bug Out Basic Plan').single())?.data?.plan_id,
        coverage_type: 2,
        face_amount: 200000,
        monthly_premium: 200,
        payment_mode: 2,
        payment_method: 2,
        payment_day: 2,
        effective_date: '2023-02-02',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        additional_notes: 'Second application for Skyler White.',
        user_id: userId,
        replacing_existing_coverage: true,
        effective_first_draft_date: '2023-01-16',
        replaced_policy_number: 'REP123457',
        replaced_face_amount: '100000',
        replaced_coverage_type: 'Type B',
        replaced_premium_amount: '100',
        replaced_has_bank_draft_been_stopped: true,
        carrier_1: (await supabase.from('carriers').select('carrier_id').eq('carrier_name', 'Vamonos Pest Insurance').single())?.data?.carrier_id,
        carrier_2: null,
        replaced_carrier_1: null,
        replaced_carrier_2: null,
        carrier_plan_1: (await supabase.from('carrier_plans').select('plan_id').eq('plan_name', 'Bug Out Basic Plan').single())?.data?.plan_id,
        carrier_plan_2: null,
        has_bank_draft_been_stopped: true,
        person_id: (await supabase.from('persons').select('person_id').eq('first_name', 'Skyler').eq('last_name', 'White')
          .single())?.data?.person_id,
        age_on_effective_date: 45,
        age_on_replacement_date: '2023-12-31 00:00:00+00',
        cancel_or_cash_in_date: '2023-12-31',
        middle_initial: 'A',
        gender: 'Female',
        tobacco_use: 'No',
        commission_rate: 0.2,
        first_name: 'Skyler',
        last_name: 'White',
        street_address: '4901 Cumbre Del Sur Ct NE',
        street_address2: '',
        city: 'Albuquerque',
        state_code: 'NM',
        zip: '87111',
        county_id: null,
        phone1: '505-234-5678',
        dob: '1970-08-11',
      },
    ]);

    // Step 10: Create Appointments
    await supabase.from('appointments').insert([
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Potential client interested in end-of-life insurance.').single())?.data?.id, user_id: userId, start_date: '2023-01-10 10:00:00', end_date: '2023-01-10 11:00:00', title: 'Meeting with Walter White', note: 'Discuss end-of-life insurance options.', google_event_id: 'event123', last_fetch: new Date().toISOString(),
      },
      {
        lead_id: (await supabase.from('leads').select('id').eq('quick_note', 'Follow-up needed for insurance policy.').single())?.data?.id, user_id: userId, start_date: '2023-01-11 10:00:00', end_date: '2023-01-11 11:00:00', title: 'Follow-up with Skyler White', note: 'Review policy details.', google_event_id: 'event124', last_fetch: new Date().toISOString(),
      },
    ]);

    return new NextResponse(JSON.stringify({ message: 'User data seeded successfully.' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error seeding user data:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to seed user data.', details: JSON.stringify(error, Object.getOwnPropertyNames(error)) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
