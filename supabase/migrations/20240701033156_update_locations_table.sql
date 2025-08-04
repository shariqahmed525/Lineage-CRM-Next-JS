-- Step 1: Remove the foreign key constraint on the county_id column in the locations table
ALTER TABLE locations DROP CONSTRAINT IF EXISTS locations_county_id_fkey;

-- Step 2: Check if the "county" column already exists in the "locations" table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='locations' AND column_name='county') THEN
    -- Add the new county column to the locations table
    ALTER TABLE locations ADD COLUMN county VARCHAR(255);
  END IF;
END $$;

-- Step 3: Migrate existing county data from the counties table to the new county column in the locations table
UPDATE locations
SET county = counties.county_name
FROM counties
WHERE locations.county_id = counties.county_id;

-- Step 4: Drop the counties table
DROP TABLE IF EXISTS counties;