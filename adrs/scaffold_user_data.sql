
-- This script is used to populate the 'lead_statuses' and 'leads' tables in the Supabase database.
-- The 'lead_statuses' table is populated with four statuses: 'New', 'Contacted', 'Qualified', and 'Converted'.
-- The 'leads' table is populated with various fictional characters from the TV show 'Breaking Bad', each with a unique UUID, current date, user ID, lead status, and other personal details.
--
-- To run this script in the Supabase web UI, follow these steps:
-- 1. Log in to your Supabase account.
-- 2. Navigate to the 'SQL' section in the left-hand menu.
-- 3. Click on the 'New Query' button.
-- 4. Copy and paste this script into the query editor.
-- 5. **IMPORTANT**: Replace the 'YOUR_USER_ID' placeholder in each INSERT INTO leads statement with your own user ID. This can be found in the 'Auth' section under 'Users' in the Supabase UI. You can use AI to do this by dropping in the following prompt: "Replace all instances of 'YOUR_USER_ID' with my actual user ID in the following SQL script: [insert your script here]".
-- 6. Click 'Run' to execute the script.
--
-- Please note that this script is intended for demonstration purposes and the data created does not represent real individuals or addresses.

INSERT INTO lead_statuses (status_id, status_name, created_by)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'New', 'YOUR_USER_ID'),
  ('123e4567-e89b-12d3-a456-426614174001', 'Contacted', 'YOUR_USER_ID'),
  ('123e4567-e89b-12d3-a456-426614174002', 'Qualified', 'YOUR_USER_ID'),
  ('123e4567-e89b-12d3-a456-426614174003', 'Converted', 'YOUR_USER_ID');

-- Insert into leads
INSERT INTO leads (
  id, record_day, user_id, date_received, lead_status_id, lead_type, 
  first_name, last_name, phone1, street_address, city, state_code, zip, 
  county, email_address, date_created, lat, lng, location_result_type, lead_source_id
)
VALUES
  (gen_random_uuid (), now(), 'YOUR_USER_ID', now(), '123e4567-e89b-12d3-a456-426614174000', 'Residential', 'Walter', 'White', '555-1234', '308 Negra Arroyo Lane', 'Albuquerque', 'NM', '87104', 'Bernalillo', 'walter@ww.com', now(), 35.0853, -106.6056, 'residential', '1371f261-b9df-440d-a1a2-aee1b3079468'),
  (gen_random_uuid (), now(), 'YOUR_USER_ID', now(), '123e4567-e89b-12d3-a456-426614174000', 'Residential', 'Jesse', 'Pinkman', '555-5678', '4901 Cumbre Del Sur Ct NE', 'Albuquerque', 'NM', '87111', 'Bernalillo', 'jesse@jp.com', now(), 35.1446, -106.4816, 'residential', '1371f261-b9df-440d-a1a2-aee1b3079468');
