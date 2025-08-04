import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';


const __dirname = dirname(fileURLToPath(import.meta.url));
const inputFile = path.join(__dirname, 'csv', 'zack-wright-data-round-2.csv');

// Configuration object
const config = {
  userId: 'd2bcf00f-51cd-4875-9d7a-09877781ea2f',
  // Add additional configuration properties here
};

const outputDir = `imports/output/${config.userId}`;
const outputFiles = {
  leads: `${outputDir}/leads.csv`,
  persons: `${outputDir}/persons.csv`,
  locations: `${outputDir}/locations.csv`,
  leads_persons: `${outputDir}/leads_persons.csv`,
  leads_locations: `${outputDir}/leads_locations.csv`,
  lead_statuses: `${outputDir}/lead_statuses.csv`,
};

// Ensure the user-specific output directory exists
fs.mkdirSync(outputDir, { recursive: true });

// Function to normalize headers
const normalizeHeader = header => header.replace(/["'`]/g, '').trim();

// Transformation functions
const addUUID = row => ({ ...row, _originalId: row.id }); // Keep track of the original ID to link entries
const changeUserId = row => ({ ...row, user_id: config.userId });

// Add this mapping object at the beginning of your script
const originalIdToNewLocationIdMap = new Map();
const originalIdToNewPersonIdMap = new Map();
const originalIdToNewLeadIdMap = new Map();

// Global mapping of lead status names to their generated UUIDs
const leadStatusNameToIdMap = new Map();

// Adjusted function to generate lead statuses and populate the mapping
const generateLeadStatusesCSV = (data) => {
  const colors = ['#c2e3c1', '#b5dbc9', '#7fc7b6', '#b6dcdc', '#acc3c3', '#729aac', '#ebc2bf', '#e6848f', '#c05965'];
  let colorIndex = 0;

  // Check if data is correctly formatted and contains lead_status
  if (data.length === 0 || !data[0].hasOwnProperty('lead_status')) {
    console.error('Data is empty or missing lead_status field');
    return;
  }

  const uniqueStatuses = new Set(data.map(row => row.lead_status).filter(status => status !== undefined));

  if (uniqueStatuses.size === 0) {
    console.error('No valid lead_status values found in data');
    return;
  }

  const leadStatusesData = Array.from(uniqueStatuses).map((status) => {
    const statusId = uuidv4();
    const badgeColorHexcode = colors[colorIndex++ % colors.length];
    leadStatusNameToIdMap.set(status, statusId);
    return {
      status_id: statusId,
      status_name: status,
      badge_color_hexcode: badgeColorHexcode,
      created_by: config.userId,
    };
  });

  const leadStatusesCSV = Papa.unparse({
    fields: ['status_id', 'status_name', 'badge_color_hexcode', 'created_by'],
    data: leadStatusesData,
  });

  fs.writeFileSync(outputFiles.lead_statuses, leadStatusesCSV, 'utf8');
  console.log(`Lead statuses CSV file has been written to ${outputFiles.lead_statuses}`);
};

const transformForLeads = (row) => {
  const newId = uuidv4();
  const leadStatusId = leadStatusNameToIdMap.get(row.lead_status); // Get the status_id from the mapping
  originalIdToNewLeadIdMap.set(row.id, newId); // Map the original ID to the new UUID
  return {
    id: newId,
    date_received: row.date_received,
    lead_type: row.lead_type,
    quick_note: row.quick_note,
    record_day: row.record_day,
    user_id: config.userId,
    lead_status_id: leadStatusId, // Include the lead_status_id
  };
};

const transformForPersons = (row) => {
  const personId = uuidv4();
  originalIdToNewPersonIdMap.set(row._originalId, personId);
  return {
    _originalId: row._originalId, // Include the original ID
    person_id: personId, // Generate a new UUID for each person
    first_name: row.first_name,
    last_name: row.last_name,
    spouse_name: row.spouse_name || '', // Ensure empty string if null
    email_address: row.email_address || '', // Ensure empty string if null
    phone1: row.phone1 || '', // Ensure empty string if null
    phone2: row.phone2 || '', // Ensure empty string if null
    user_id: row.user_id,
  };
};

const transformForLocations = (row) => {
  const locationId = uuidv4();
  const orignalRow = { ...row };
  originalIdToNewLocationIdMap.set(orignalRow._originalId, locationId);
  return {
    _originalId: row._originalId, // Include the original ID
    location_id: locationId, // Generate a new UUID for each location
    city: row.city,
    state_code: row.state,
    street_address: row.street_address,
    street_address2: row.street_address2 || '', // Ensure empty string if null
    zip: row.zip,
    lat: row.lat || '', // Ensure empty string if null
    lng: row.lng || '', // Ensure empty string if null
    user_id: row.user_id,
  };
};

// Define the transformRow function before using it
const transformRow = (row, fields, transformations) => {
  // Apply transformations to the row
  let transformedRow = { ...row };
  transformations.forEach((transformation) => {
    transformedRow = transformation(transformedRow);
  });
  return transformedRow;
};

// Placeholder for storing transformed data
const transformedLeads = [];
const transformedPersons = [];
const transformedLocations = [];

// Placeholder for storing join table data
let leadsPersonsJoinData = [];
let leadsLocationsJoinData = [];

// Define the transformForLeadsPersons function
const transformForLeadsPersons = transformedPersons => transformedPersons.map((person) => {
  const leadId = originalIdToNewLeadIdMap.get(person._originalId);
  if (!leadId) {
    console.error(`Lead ID not found for person with original ID ${person._originalId}`);
    return null; // or handle this case as needed
  }
  return {
    lead_id: leadId,
    person_id: person.person_id,
    user_id: config.userId,
  };
}).filter(entry => entry) // Filter out any null entries if a lead ID wasn't found
;

// Define the transformForLeadsLocations function
const transformForLeadsLocations = transformedLocations => transformedLocations.map((location) => {
  const leadId = originalIdToNewLeadIdMap.get(location._originalId);
  if (!leadId) {
    console.error(`Lead ID not found for location with original ID ${location._originalId}`);
    return null; // or handle this case as needed
  }
  return {
    lead_id: leadId,
    location_id: location.location_id,
    user_id: config.userId,
  };
}).filter(entry => entry) // Filter out any null entries if a lead ID wasn't found
;

// Read and parse the CSV file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the CSV file:', err);
    return;
  }

  Papa.parse(data, {
    header: true,
    transformHeader: header => header.trim(),
    complete: (results) => {
      if (results.data.length === 0) {
        console.error('Parsed data is empty');
        return;
      }

      generateLeadStatusesCSV(results.data);

      // Transform all data upfront
      results.data.forEach((row) => {
        const transformedRow = transformRow(row, results.meta.fields, [addUUID, changeUserId]);
        transformedLeads.push(transformForLeads(transformedRow));
        transformedPersons.push(transformForPersons(transformedRow));
        transformedLocations.push(transformForLocations(transformedRow));
      });

      // Generate join table data
      leadsPersonsJoinData = transformForLeadsPersons(transformedPersons);
      leadsLocationsJoinData = transformForLeadsLocations(transformedLocations);

      // Now generate all CSV files using the transformed data
      generateCSV(outputFiles.leads, ['id', 'date_received', 'lead_type', 'quick_note', 'record_day', 'user_id', 'lead_status_id'], transformedLeads);
      generateCSV(outputFiles.persons, ['person_id', 'first_name', 'last_name', 'spouse_name', 'email_address', 'phone1', 'phone2', 'user_id'], transformedPersons);
      generateCSV(outputFiles.locations, ['location_id', 'city', 'state_code', 'street_address', 'street_address2', 'zip', 'lat', 'lng', 'user_id'], transformedLocations);
      generateCSV(outputFiles.leads_persons, ['lead_id', 'person_id', 'user_id'], leadsPersonsJoinData);
      generateCSV(outputFiles.leads_locations, ['lead_id', 'location_id', 'user_id'], leadsLocationsJoinData);
    },
    skipEmptyLines: true,
  });
});

// Utility function to generate CSV files
function generateCSV(filePath, fields, data) {
  const csv = Papa.unparse({ fields, data });
  fs.writeFileSync(filePath, csv, 'utf8');
  console.log(`CSV file has been written to ${filePath}`);
}
