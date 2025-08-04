# Lineage CRM API Documentation - React Native Integration

## Objective
Senior Agent Tools has an existing mobile app, written in React Native, that we are going to repurpose with new branding, syncing with the new database schema, using Supabase Auth, and updating using our existing Lineage API

## Supabase Authentication

This is pretty straightforward, and Supabase has a [great guide on how to do this](https://supabase.com/docs/guides/auth/quickstarts/react-native)

Once you have authenticated the user, you can use the following API endpoints to fetch data from the database, and you should be authenticated as Supabase login should add the correct cookies to all requests (although you might have to code this on your request code)

## Request URL

All routes should be sent to `https://app.lineagecrm.com/api/<ROUTE URL>`

## Env Variables

Below are all of the values for staging that you might need from Supabase, specifically you will need them to setup Supabase auth, but will not need them to make requests to the API.

```
SUPABASE_BACKEND_URL=https://ndrjvihvezscmgzylopb.supabase.co
SUPABASE_BACKEND_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcmp2aWh2ZXpzY21nenlsb3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1OTU2NzcsImV4cCI6MjAxNzE3MTY3N30.HW_K5M3FHtYB9POL2Itz_aoBOcOXNw_ZMbOyan8WBlE
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcmp2aWh2ZXpzY21nenlsb3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1OTU2NzcsImV4cCI6MjAxNzE3MTY3N30.HW_K5M3FHtYB9POL2Itz_aoBOcOXNw_ZMbOyan8WBlE
```

## Lineage API Documentation

### Route URL
`GET: /api/getApplicationStatuses`

### Description of functionality
This route retrieves the application statuses from the database. It queries the `application_statuses` table to fetch all the statuses available. This route is used in the user experience to populate dropdowns or selection fields where application statuses are required. Specifically, it is used in the `app/pages/settings/page.tsx` file to display the list of application statuses in the settings page.

Example query:
```sql
SELECT * FROM application_statuses;
```

### Example Request Payload Format (JSON)
```json
{}
```

### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "status": "Pending"
  },
  {
    "id": 2,
    "status": "Approved"
  },
  {
    "id": 3,
    "status": "Rejected"
  }
]
```

### Route URL
`GET: /api/getAllLeadSources`

### Description of functionality
This route retrieves all lead sources from the database. It queries the `lead_sources` table to fetch all the lead sources available. This route is used in the user experience to populate dropdowns or selection fields where lead sources are required. Specifically, it is used in the `app/components/LeadsFilterDrawer/index.tsx` file to display the list of lead sources in the leads filter drawer.

Example query:
```sql
SELECT * FROM lead_sources;
```

### Example Request Payload Format (JSON)
```json
{}
```

### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "source": "Website"
  },
  {
    "id": 2,
    "source": "Referral"
  },
  {
    "id": 3,
    "source": "Advertisement"
  }
]
```

### Route URL
`GET: /api/getLeadStatuses`

### Description of functionality
This route retrieves the lead statuses from the database. It queries the `lead_statuses` table to fetch all the statuses available. This route is used in the user experience to populate dropdowns or selection fields where lead statuses are required. Specifically, it is used in the `app/components/LeadStatusSettings/index.tsx` file to display the list of lead statuses in the lead status settings.

Example query:
```sql
SELECT * FROM lead_statuses;
```

### Example Request Payload Format (JSON)
```json
{}
```

### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "status": "New"
  },
  {
    "id": 2,
    "status": "Contacted"
  },
  {
    "id": 3,
    "status": "Qualified"
  }
]
```

### Route URL
`GET: /api/getAllLeads`

### Description of functionality
This route retrieves all leads from the database. It queries the `leads` table to fetch all the leads available. Additionally, it joins the `persons` and `locations` tables to include related persons and locations information. This route is used in the user experience to display the list of all leads. Specifically, it is used in the `app/pages/leads/page.tsx` file to display the list of leads in the leads page.

Example query:
```sql
SELECT 
  leads.*, 
  persons.*, 
  locations.* 
FROM 
  leads 
INNER JOIN 
  leads_persons ON leads.id = leads_persons.lead_id 
INNER JOIN 
  persons ON leads_persons.person_id = persons.id 
INNER JOIN 
  leads_locations ON leads.id = leads_locations.lead_id 
INNER JOIN 
  locations ON leads_locations.location_id = locations.id;
```

### Example Request Payload Format (JSON)
```json
{}
```

### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "lead_name": "Lead 1",
    "person": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    },
    "location": {
      "id": 1,
      "address": "123 Main St"
    }
  },
  {
    "id": 2,
    "lead_name": "Lead 2",
    "person": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith"
    },
    "location": {
      "id": 2,
      "address": "456 Elm St"
    }
  }
]
```

### Route URL
`PUT: /api/updateLeadSource`

### Description of functionality
This route updates a lead source in the database. It queries the `lead_sources` table to update the lead source with the provided data. This route is used in the user experience to update lead sources. Specifically, it is used in the `app/components/SettingsComponents/EditLeadSourceModal/index.tsx` file to update the lead source information in the settings.

Example query:
```sql
UPDATE lead_sources
SET source = 'Updated Source'
WHERE id = 1;
```

### Example Request Payload Format (JSON)
```json
{
  "id": 1,
  "source": "Updated Source"
}
```

### Example Response Body (JSON)
```json
{
  "id": 1,
  "source": "Updated Source"
}
```

### Route URL
`DELETE: /api/deleteLeadSource`

### Description of functionality
This route deletes a lead source from the database. It queries the `lead_sources` table to delete the lead source with the provided ID. This route is used in the user experience to delete lead sources. Specifically, it is used in the `app/components/SettingsComponents/EditLeadSourceModal/index.tsx` file to delete the lead source information in the settings.

Example query:
```sql
DELETE FROM lead_sources
WHERE id = 1;
```

### Example Request Payload Format (JSON)
```json
{
  "id": 1
}
```

### Example Response Body (JSON)
```json
{
  "message": "Lead source deleted successfully."
}
```

### Route URL
`POST: /api/createLeadSource`

#### Description of functionality
This route creates a new lead source in the database. It queries the `lead_sources` table to insert a new lead source with the provided data. This route is used in the user experience to create new lead sources. Specifically, it is used in the `app/components/SettingsComponents/CreateLeadSourceModal/index.tsx` file to create a new lead source in the settings.

Example query:
```sql
INSERT INTO lead_sources (source, user_id)
VALUES ('New Source', 'user-id-123');
```

#### Example Request Payload Format (JSON)
```json
{
  "source": "New Source",
  "user_id": "user-id-123"
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "source": "New Source",
  "user_id": "user-id-123"
}
```

### Route URL
`POST: /api/createApplication`

#### Description of functionality
This route creates a new application in the database. It queries the `applications` table to insert a new application with the provided data. This route is used in the user experience to create new applications. Specifically, it is used in the `app/pages/applications/create.tsx` file to create a new application.

Example query:
```sql
INSERT INTO applications (application_name, user_id)
VALUES ('New Application', 'user-id-123');
```

#### Example Request Payload Format (JSON)
```json
{
  "application_name": "New Application",
  "user_id": "user-id-123"
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "application_name": "New Application",
  "user_id": "user-id-123"
}
```

### Route URL
`GET: /api/getAllApplications`

#### Description of functionality
This route retrieves all applications from the database. It queries the `applications` table to fetch all the applications available. This route is used in the user experience to display the list of all applications. Specifically, it is used in the `app/pages/applications/index.tsx` file to display the list of applications in the applications page.

Example query:
```sql
SELECT * FROM applications;
```

#### Example Request Payload Format (JSON)
```json
{}
```

#### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "application_name": "Application 1",
    "user_id": "user-id-123"
  },
  {
    "id": 2,
    "application_name": "Application 2",
    "user_id": "user-id-456"
  }
]
```

### Route URL
`PUT: /api/updateApplication`

#### Description of functionality
This route updates an application in the database. It queries the `applications` table to update the application with the provided data. This route is used in the user experience to update applications. Specifically, it is used in the `app/pages/applications/edit.tsx` file to update the application information.

Example query:
```sql
UPDATE applications
SET application_name = 'Updated Application'
WHERE id = 1;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1,
  "application_name": "Updated Application"
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "application_name": "Updated Application",
  "user_id": "user-id-123"
}
```

### Route URL
`DELETE: /api/deleteApplication`

#### Description of functionality
This route deletes an application from the database. It queries the `applications` table to delete the application with the provided ID. This route is used in the user experience to delete applications. Specifically, it is used in the `app/pages/applications/index.tsx` file to delete an application from the list of applications.

Example query:
```sql
DELETE FROM applications
WHERE id = 1;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1
}
```

#### Example Response Body (JSON)
```json
{
  "message": "Application deleted successfully."
}
```

### Route URL
`GET: /api/getLeadDetails`

#### Description of functionality
This route retrieves the details of a specific lead from the database. It queries the `leads` table to fetch the lead with the provided ID. Additionally, it joins the `persons` and `locations` tables to include related persons and locations information. This route is used in the user experience to display the details of a specific lead. Specifically, it is used in the `app/pages/leads/details.tsx` file to display the lead details in the lead details page.

Example query:
```sql
SELECT 
  leads.*,
  persons.*,
  locations.*
FROM 
  leads
INNER JOIN 
  leads_persons ON leads.id = leads_persons.lead_id
INNER JOIN 
  persons ON leads_persons.person_id = persons.id
INNER JOIN 
  leads_locations ON leads.id = leads_locations.lead_id
INNER JOIN 
  locations ON leads_locations.location_id = locations.id
WHERE 
  leads.id = ?;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "lead_name": "Lead 1",
  "person": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe"
  },
  "location": {
    "id": 1,
    "address": "123 Main St"
  }
}
```

### Route URL
`POST: /api/createLead`

#### Description of functionality
This route creates a new lead in the database. It queries the `leads` table to insert a new lead with the provided data. This route is used in the user experience to create new leads. Specifically, it is used in the `app/pages/leads/create.tsx` file to create a new lead.

Example query:
```sql
INSERT INTO leads (lead_name, person_id, location_id)
VALUES ('New Lead', 1, 1);
```

#### Example Request Payload Format (JSON)
```json
{
  "lead_name": "New Lead",
  "person_id": 1,
  "location_id": 1
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "lead_name": "New Lead",
  "person_id": 1,
  "location_id": 1
}
```

### Route URL
`PUT: /api/updateLead`

#### Description of functionality
This route updates a lead in the database. It queries the `leads` table to update the lead with the provided data. This route is used in the user experience to update leads. Specifically, it is used in the `app/pages/leads/edit.tsx` file to update the lead information.

Example query:
```sql
UPDATE leads
SET lead_name = 'Updated Lead', person_id = 2, location_id = 2
WHERE id = 1;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1,
  "lead_name": "Updated Lead",
  "person_id": 2,
  "location_id": 2
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "lead_name": "Updated Lead",
  "person_id": 2,
  "location_id": 2
}
```

### Route URL
`DELETE: /api/deleteLead`

#### Description of functionality
This route deletes a lead from the database. It queries the `leads` table to delete the lead with the provided ID. This route is used in the user experience to delete leads. Specifically, it is used in the `app/pages/leads/index.tsx` file to delete a lead from the list of leads.

Example query:
```sql
DELETE FROM leads
WHERE id = 1;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1
}
```

#### Example Response Body (JSON)
```json
{
  "message": "Lead deleted successfully."
}
```

### Route URL
`GET: /api/getLeadActivities`

#### Description of functionality
This route retrieves the activities associated with a specific lead from the database. It queries the `lead_activities` table to fetch the activities for the lead with the provided ID. This route is used in the user experience to display the activities for a specific lead. Specifically, it is used in the `app/pages/leads/details.tsx` file to display the lead activities in the lead details page.

Example query:
```sql
SELECT * FROM lead_activities WHERE lead_id = ?;
```

#### Example Request Payload Format (JSON)
```json
{
  "lead_id": 1
}
```

#### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "lead_id": 1,
    "activity_type": "Call",
    "activity_date": "2023-01-01T12:00:00.000Z",
    "notes": "This is a call activity."
  },
  {
    "id": 2,
    "lead_id": 1,
    "activity_type": "Email",
    "activity_date": "2023-01-02T14:00:00.000Z",
    "notes": "This is an email activity."
  }
]
```

### Route URL
`POST: /api/processLeads`

#### Description of functionality
This route processes a list of leads in the database. It queries the `leads` table to update the leads with the provided data. This route is used in the user experience to process leads in bulk. Specifically, it is used in the `app/pages/leads/process.tsx` file to process leads.

Example query:
```sql
UPDATE leads
SET status_id = ?, lead_status_id = ?, application_id = ?
WHERE id IN (?);
```

#### Example Request Payload Format (JSON)
```json
{
  "leads": [
    {
      "id": 1,
      "status_id": 1,
      "lead_status_id": 2,
      "application_id": 3
    },
    {
      "id": 2,
      "status_id": 2,
      "lead_status_id": 1,
      "application_id": 1
    }
  ]
}
```

#### Example Response Body (JSON)
```json
{
  "message": "Leads processed successfully."
}
```

### Route URL
`GET: /api/getLeadSources`

#### Description of functionality
# Lineage CRM Supabase - React Native Integration

## Objective
Senior Agent Tools has an existing mobile app, written in React Native, that we are going to repurpose with new branding, syncing with the new database schema, using Supabase Auth, and updating using our existing Lineage API

## Supabase Authentication

This is pretty straightforward, and Supabase has a [great guide on how to do this](https://supabase.com/docs/guides/auth/quickstarts/react-native)

## Lineage API Documentation

### Route URL
`GET: /api/getApplicationStatuses`

### Description of functionality
This route retrieves the application statuses from the database. It queries the `application_statuses` table to fetch all the statuses available. This route is used in the user experience to populate dropdowns or selection fields where application statuses are required. Specifically, it is used in the `app/pages/settings/page.tsx` file to display the list of application statuses in the settings page.

Example query:
```sql
SELECT * FROM application_statuses;
```

### Example Request Payload Format (JSON)
```json
{}
```

### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "status": "Pending"
  },
  {
    "id": 2,
    "status": "Approved"
  },
  {
    "id": 3,
    "status": "Rejected"
  }
]
```

### Route URL
`GET: /api/getAllLeadSources`

### Description of functionality
This route retrieves all lead sources from the database. It queries the `lead_sources` table to fetch all the lead sources available. This route is used in the user experience to populate dropdowns or selection fields where lead sources are required. Specifically, it is used in the `app/components/LeadsFilterDrawer/index.tsx` file to display the list of lead sources in the leads filter drawer.

Example query:
```sql
SELECT * FROM lead_sources;
```

### Example Request Payload Format (JSON)
```json
{}
```

### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "source": "Website"
  },
  {
    "id": 2,
    "source": "Referral"
  },
  {
    "id": 3,
    "source": "Advertisement"
  }
]
```

### Route URL
`GET: /api/getLeadStatuses`

### Description of functionality
This route retrieves the lead statuses from the database. It queries the `lead_statuses` table to fetch all the statuses available. This route is used in the user experience to populate dropdowns or selection fields where lead statuses are required. Specifically, it is used in the `app/components/LeadStatusSettings/index.tsx` file to display the list of lead statuses in the lead status settings.

Example query:
```sql
SELECT * FROM lead_statuses;
```

### Example Request Payload Format (JSON)
```json
{}
```

### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "status": "New"
  },
  {
    "id": 2,
    "status": "Contacted"
  },
  {
    "id": 3,
    "status": "Qualified"
  }
]
```

### Route URL
`GET: /api/getAllLeads`

### Description of functionality
This route retrieves all leads from the database. It queries the `leads` table to fetch all the leads available. Additionally, it joins the `persons` and `locations` tables to include related persons and locations information. This route is used in the user experience to display the list of all leads. Specifically, it is used in the `app/pages/leads/page.tsx` file to display the list of leads in the leads page.

Example query:
```sql
SELECT 
  leads.*, 
  persons.*, 
  locations.* 
FROM 
  leads 
INNER JOIN 
  leads_persons ON leads.id = leads_persons.lead_id 
INNER JOIN 
  persons ON leads_persons.person_id = persons.id 
INNER JOIN 
  leads_locations ON leads.id = leads_locations.lead_id 
INNER JOIN 
  locations ON leads_locations.location_id = locations.id;
```

### Example Request Payload Format (JSON)
```json
{}
```

### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "lead_name": "Lead 1",
    "person": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    },
    "location": {
      "id": 1,
      "address": "123 Main St"
    }
  },
  {
    "id": 2,
    "lead_name": "Lead 2",
    "person": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith"
    },
    "location": {
      "id": 2,
      "address": "456 Elm St"
    }
  }
]
```

### Route URL
`PUT: /api/updateLeadSource`

### Description of functionality
This route updates a lead source in the database. It queries the `lead_sources` table to update the lead source with the provided data. This route is used in the user experience to update lead sources. Specifically, it is used in the `app/components/SettingsComponents/EditLeadSourceModal/index.tsx` file to update the lead source information in the settings.

Example query:
```sql
UPDATE lead_sources
SET source = 'Updated Source'
WHERE id = 1;
```

### Example Request Payload Format (JSON)
```json
{
  "id": 1,
  "source": "Updated Source"
}
```

### Example Response Body (JSON)
```json
{
  "id": 1,
  "source": "Updated Source"
}
```

### Route URL
`DELETE: /api/deleteLeadSource`

### Description of functionality
This route deletes a lead source from the database. It queries the `lead_sources` table to delete the lead source with the provided ID. This route is used in the user experience to delete lead sources. Specifically, it is used in the `app/components/SettingsComponents/EditLeadSourceModal/index.tsx` file to delete the lead source information in the settings.

Example query:
```sql
DELETE FROM lead_sources
WHERE id = 1;
```

### Example Request Payload Format (JSON)
```json
{
  "id": 1
}
```

### Example Response Body (JSON)
```json
{
  "message": "Lead source deleted successfully."
}
```

### Route URL
`POST: /api/createLeadSource`

#### Description of functionality
This route creates a new lead source in the database. It queries the `lead_sources` table to insert a new lead source with the provided data. This route is used in the user experience to create new lead sources. Specifically, it is used in the `app/components/SettingsComponents/CreateLeadSourceModal/index.tsx` file to create a new lead source in the settings.

Example query:
```sql
INSERT INTO lead_sources (source, user_id)
VALUES ('New Source', 'user-id-123');
```

#### Example Request Payload Format (JSON)
```json
{
  "source": "New Source",
  "user_id": "user-id-123"
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "source": "New Source",
  "user_id": "user-id-123"
}
```

### Route URL
`POST: /api/createApplication`

#### Description of functionality
This route creates a new application in the database. It queries the `applications` table to insert a new application with the provided data. This route is used in the user experience to create new applications. Specifically, it is used in the `app/pages/applications/create.tsx` file to create a new application.

Example query:
```sql
INSERT INTO applications (application_name, user_id)
VALUES ('New Application', 'user-id-123');
```

#### Example Request Payload Format (JSON)
```json
{
  "application_name": "New Application",
  "user_id": "user-id-123"
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "application_name": "New Application",
  "user_id": "user-id-123"
}
```

### Route URL
`GET: /api/getAllApplications`

#### Description of functionality
This route retrieves all applications from the database. It queries the `applications` table to fetch all the applications available. This route is used in the user experience to display the list of all applications. Specifically, it is used in the `app/pages/applications/index.tsx` file to display the list of applications in the applications page.

Example query:
```sql
SELECT * FROM applications;
```

#### Example Request Payload Format (JSON)
```json
{}
```

#### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "application_name": "Application 1",
    "user_id": "user-id-123"
  },
  {
    "id": 2,
    "application_name": "Application 2",
    "user_id": "user-id-456"
  }
]
```

### Route URL
`PUT: /api/updateApplication`

#### Description of functionality
This route updates an application in the database. It queries the `applications` table to update the application with the provided data. This route is used in the user experience to update applications. Specifically, it is used in the `app/pages/applications/edit.tsx` file to update the application information.

Example query:
```sql
UPDATE applications
SET application_name = 'Updated Application'
WHERE id = 1;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1,
  "application_name": "Updated Application"
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "application_name": "Updated Application",
  "user_id": "user-id-123"
}
```

### Route URL
`DELETE: /api/deleteApplication`

#### Description of functionality
This route deletes an application from the database. It queries the `applications` table to delete the application with the provided ID. This route is used in the user experience to delete applications. Specifically, it is used in the `app/pages/applications/index.tsx` file to delete an application from the list of applications.

Example query:
```sql
DELETE FROM applications
WHERE id = 1;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1
}
```

#### Example Response Body (JSON)
```json
{
  "message": "Application deleted successfully."
}
```

### Route URL
`GET: /api/getLeadDetails`

#### Description of functionality
This route retrieves the details of a specific lead from the database. It queries the `leads` table to fetch the lead with the provided ID. Additionally, it joins the `persons` and `locations` tables to include related persons and locations information. This route is used in the user experience to display the details of a specific lead. Specifically, it is used in the `app/pages/leads/details.tsx` file to display the lead details in the lead details page.

Example query:
```sql
SELECT 
  leads.*,
  persons.*,
  locations.*
FROM 
  leads
INNER JOIN 
  leads_persons ON leads.id = leads_persons.lead_id
INNER JOIN 
  persons ON leads_persons.person_id = persons.id
INNER JOIN 
  leads_locations ON leads.id = leads_locations.lead_id
INNER JOIN 
  locations ON leads_locations.location_id = locations.id
WHERE 
  leads.id = ?;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "lead_name": "Lead 1",
  "person": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe"
  },
  "location": {
    "id": 1,
    "address": "123 Main St"
  }
}
```

### Route URL
`POST: /api/createLead`

#### Description of functionality
This route creates a new lead in the database. It queries the `leads` table to insert a new lead with the provided data. This route is used in the user experience to create new leads. Specifically, it is used in the `app/pages/leads/create.tsx` file to create a new lead.

Example query:
```sql
INSERT INTO leads (lead_name, person_id, location_id)
VALUES ('New Lead', 1, 1);
```

#### Example Request Payload Format (JSON)
```json
{
  "lead_name": "New Lead",
  "person_id": 1,
  "location_id": 1
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "lead_name": "New Lead",
  "person_id": 1,
  "location_id": 1
}
```

### Route URL
`PUT: /api/updateLead`

#### Description of functionality
This route updates a lead in the database. It queries the `leads` table to update the lead with the provided data. This route is used in the user experience to update leads. Specifically, it is used in the `app/pages/leads/edit.tsx` file to update the lead information.

Example query:
```sql
UPDATE leads
SET lead_name = 'Updated Lead', person_id = 2, location_id = 2
WHERE id = 1;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1,
  "lead_name": "Updated Lead",
  "person_id": 2,
  "location_id": 2
}
```

#### Example Response Body (JSON)
```json
{
  "id": 1,
  "lead_name": "Updated Lead",
  "person_id": 2,
  "location_id": 2
}
```

### Route URL
`DELETE: /api/deleteLead`

#### Description of functionality
This route deletes a lead from the database. It queries the `leads` table to delete the lead with the provided ID. This route is used in the user experience to delete leads. Specifically, it is used in the `app/pages/leads/index.tsx` file to delete a lead from the list of leads.

Example query:
```sql
DELETE FROM leads
WHERE id = 1;
```

#### Example Request Payload Format (JSON)
```json
{
  "id": 1
}
```

#### Example Response Body (JSON)
```json
{
  "message": "Lead deleted successfully."
}
```

### Route URL
`GET: /api/getLeadActivities`

#### Description of functionality
This route retrieves the activities associated with a specific lead from the database. It queries the `lead_activities` table to fetch the activities for the lead with the provided ID. This route is used in the user experience to display the activities for a specific lead. Specifically, it is used in the `app/pages/leads/details.tsx` file to display the lead activities in the lead details page.

Example query:
```sql
SELECT * FROM lead_activities WHERE lead_id = ?;
```

#### Example Request Payload Format (JSON)
```json
{
  "lead_id": 1
}
```

#### Example Response Body (JSON)
```json
[
  {
    "id": 1,
    "lead_id": 1,
    "activity_type": "Call",
    "activity_date": "2023-01-01T12:00:00.000Z",
    "notes": "This is a call activity."
  },
  {
    "id": 2,
    "lead_id": 1,
    "activity_type": "Email",
    "activity_date": "2023-01-02T14:00:00.000Z",
    "notes": "This is an email activity."
  }
]
```

### Route URL
`POST: /api/processLeads`

#### Description of functionality
This route processes a list of leads in the database. It queries the `leads` table to update the leads with the provided data. This route is used in the user experience to process leads in bulk. Specifically, it is used in the `app/pages/leads/process.tsx` file to process leads.

Example query:
```sql
UPDATE leads
SET status_id = ?, lead_status_id = ?, application_id = ?
WHERE id IN (?);
```

#### Example Request Payload Format (JSON)
```json
{
  "leads": [
    {
      "id": 1,
      "status_id": 1,
      "lead_status_id": 2,
      "application_id": 3
    },
    {
      "id": 2,
      "status_id": 2,
      "lead_status_id": 1,
      "application_id": 1
    }
  ]
}
```

#### Example Response Body (JSON)
```json
{
  "message": "Leads processed successfully."
}
```







