-- Step 1: Check if the county_id column exists in the locations table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'locations'
        AND column_name = 'county_id'
    ) THEN
        -- Step 2: Check if the counties table exists
        IF EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'counties'
        ) THEN
            -- Step 3: Transfer data from county_id to a new column 'county' in the locations table
            ALTER TABLE locations ADD COLUMN IF NOT EXISTS county VARCHAR(255);
            UPDATE locations
            SET county = counties.county_name
            FROM counties
            WHERE locations.county_id = counties.county_id;
        END IF;

        -- Step 4: Drop any foreign key constraints or indexes that depend on the county_id column
        ALTER TABLE locations DROP CONSTRAINT IF EXISTS locations_county_id_fkey;
        ALTER TABLE leads_locations DROP CONSTRAINT IF EXISTS leads_locations_location_id_fkey;

        -- Step 5: Drop the county_id column from the locations table
        ALTER TABLE locations DROP COLUMN IF EXISTS county_id CASCADE;

        -- Step 6: Recreate the foreign key constraints or indexes if needed
        ALTER TABLE leads_locations ADD CONSTRAINT leads_locations_location_id_fkey FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 7: Handle any other dependencies or cleanup
-- Drop the counties table if it is no longer needed
DROP TABLE IF EXISTS counties;

-- Step 8: Drop and recreate the materialized view
DROP MATERIALIZED VIEW IF EXISTS public.search_leads;
CREATE MATERIALIZED VIEW public.search_leads AS
SELECT l.id AS lead_id,
    array_agg(DISTINCT ((((((((p.first_name || ' '::text) || p.last_name) || ' '::text) || p.phone1) || ' '::text) || p.phone2) || ' '::text) || p.email_address)) AS person_details,
    array_agg(DISTINCT ((((((((((((loc.street_address || ' '::text) || loc.city) || ' '::text) || loc.state_code) || ' '::text) || loc.zip) || ' '::text) || (loc.county)::text) || ' '::text) || (loc.lat)::text) || ' '::text) || (loc.lng)::text)) AS location_details,
    to_tsvector('english'::regconfig, ((array_to_string(array_agg(DISTINCT ((((((((p.first_name || ' '::text) || p.last_name) || ' '::text) || p.phone1) || ' '::text) || p.phone2) || ' '::text) || p.email_address)), ' '::text) || ' '::text) || array_to_string(array_agg(DISTINCT ((((((((((((loc.street_address || ' '::text) || loc.city) || ' '::text) || loc.state_code) || ' '::text) || loc.zip) || ' '::text) || (loc.county)::text) || ' '::text) || (loc.lat)::text) || ' '::text) || (loc.lng)::text)), ' '::text))) AS fts
FROM ((((leads l
    JOIN leads_persons lp ON ((l.id = lp.lead_id)))
    JOIN persons p ON ((lp.person_id = p.person_id)))
    JOIN leads_locations ll ON ((l.id = ll.lead_id)))
    JOIN locations loc ON ((ll.location_id = loc.location_id)))
GROUP BY l.id;

-- Step 9: Recreate indexes on the materialized view
CREATE INDEX search_leads_fts ON public.search_leads USING gin (fts);
CREATE UNIQUE INDEX search_leads_lead_id_idx ON public.search_leads USING btree (lead_id);