## What is this?

Using chatGPT on screenshots of both the designs for Lineage and the old Senior Agent tools platform we generated the following database schema:

```sql
-- Lead Statuses Table
CREATE TABLE lead_statuses (
    status_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_name TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_lead_statuses_created_by ON lead_statuses(created_by);
ALTER TABLE lead_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_lead_statuses ON lead_statuses
    FOR ALL USING (auth.uid() = created_by);

-- Counties Table
CREATE TABLE counties (
    county_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    county_name TEXT NOT NULL,
    state_name VARCHAR(255) NOT NULL
);

-- Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_day DATE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    date_received DATE NOT NULL,
    lead_status_id UUID REFERENCES lead_statuses(status_id),
    lead_type TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone1 VARCHAR(20),
    phone2 VARCHAR(20),
    street_address TEXT NOT NULL,
    street_address2 TEXT,
    city TEXT NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    county_id UUID REFERENCES counties(county_id), -- Foreign key reference to Counties
    age INT2,
    spouse_name TEXT,
    spouse_age INT2,
    email_address VARCHAR(255),
    quick_note TEXT,
    called_phone1 BOOL DEFAULT FALSE,
    called_phone2 BOOL DEFAULT FALSE,
    attachment TEXT,
    url_link TEXT,
    date_created TIMESTAMPTZ DEFAULT NOW(),
    lat FLOAT8,
    lng FLOAT8,
    location_result_type TEXT
);

-- Create indexes for frequently queried and joined columns in leads
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_lead_status_id ON leads(lead_status_id);
CREATE INDEX idx_leads_date_received ON leads(date_received);
CREATE INDEX idx_leads_phone1 ON leads(phone1);
CREATE INDEX idx_leads_email_address ON leads(email_address);
CREATE INDEX idx_leads_county_id ON leads(county_id); -- Index for the county_id foreign key

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_leads ON leads
    FOR ALL USING (auth.uid() = user_id);

-- Activity Table
CREATE TABLE activity (
    activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    action_type TEXT NOT NULL,
    action_date TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);
-- (Indexes for activity table as before)
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_activity ON activity
    FOR ALL USING (auth.uid() = created_by);

-- Notes Table
CREATE TABLE notes (
    note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);
-- (Indexes for notes table as before)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_notes ON notes
    FOR ALL USING (auth.uid() = created_by);

-- Appointments Table
CREATE TABLE appointments (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    user_id UUID REFERENCES auth.users(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    title TEXT NOT NULL,
    note TEXT
);
-- (Indexes for appointments table as before)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_appointments ON appointments
    FOR ALL USING (auth.uid() = user_id);

-- Carriers Table
CREATE TABLE carriers (
    carrier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrier_name TEXT NOT NULL,
    parent_code VARCHAR(255) DEFAULT NULL, -- Parent Code can be NULL
    logo_url TEXT, -- URL to the carrier's logo
    website TEXT, -- URL to the carrier's website
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carrier Plan Statuses Table
CREATE TABLE carrier_plan_statuses (
    status_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Carrier Plans Table
CREATE TABLE carrier_plans (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrier_id UUID REFERENCES carriers(carrier_id),
    status_id UUID REFERENCES carrier_plan_statuses(status_id), -- Foreign key to Carrier Plan Statuses
    plan_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Carriers and Carrier Plans
CREATE INDEX idx_carrier_plans_carrier_id ON carrier_plans(carrier_id);
CREATE INDEX idx_carrier_plans_status_id ON carrier_plans(status_id);

-- Agent Commission Rates Table
CREATE TABLE agent_commission_rates (
    commission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    plan_id UUID REFERENCES carrier_plans(plan_id),
    commission_rate FLOAT8 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE agent_commission_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_agent_commission_rates ON agent_commission_rates
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for Agent Commission Rates
CREATE INDEX idx_agent_commission_rates_user_id ON agent_commission_rates(user_id);
CREATE INDEX idx_agent_commission_rates_plan_id ON agent_commission_rates(plan_id);

-- Applications Table
CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    application_date DATE NOT NULL,
    status VARCHAR(255),
    policy_number VARCHAR(255) UNIQUE,
    plan_id UUID REFERENCES carrier_plans(plan_id),
    coverage_type VARCHAR(50),
    face_amount FLOAT8,
    monthly_premium FLOAT8,
    payment_mode VARCHAR(50),
    payment_method VARCHAR(50),
    payment_day INT,
    effective_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    additional_notes TEXT
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_applications ON applications
    FOR ALL USING (true); -- Adjust policy as needed

-- Indexes for the Applications Table
CREATE INDEX idx_applications_lead_id ON applications(lead_id);
CREATE INDEX idx_applications_policy_number ON applications(policy_number);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_plan_id ON applications(plan_id);

-- Tasks Table
CREATE TABLE tasks (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) NULL,
    application_id UUID REFERENCES applications(application_id) NULL,
    assigned_to UUID REFERENCES auth.users(id),
    due_date DATE NOT NULL,
    task_description TEXT NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_tasks ON tasks
    FOR ALL USING (auth.uid() = assigned_to);

-- Indexes for the Tasks Table
CREATE INDEX idx_tasks_lead_id ON tasks(lead_id);
CREATE INDEX idx_tasks_application_id ON tasks(application_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Application History Table
CREATE TABLE application_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(application_id),
    changed_by UUID REFERENCES auth.users(id),
    change_description TEXT NOT NULL,
    change_date TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE application_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_application_history ON application_history
    FOR ALL USING (auth.uid() = changed_by);

-- Index for the Application History Table
CREATE INDEX idx_application_history_application_id ON application_history(application_id);
CREATE INDEX idx_application_history_changed_by ON application_history(changed_by);

-- Annual Goals Table
CREATE TABLE annual_goals (
    goal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    year INT NOT NULL,
    ap_goal FLOAT8 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE annual_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_annual_goals ON annual_goals
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for Annual Goals
CREATE INDEX idx_annual_goals_user_id ON annual_goals(user_id);
CREATE INDEX idx_annual_goals_year ON annual_goals(year);

-- Lead Analytics Table
CREATE TABLE lead_analytics (
    analytic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    date_snapshot DATE NOT NULL,
    direct_mail_leads INT4,
    cost_per_direct_mail FLOAT8,
    telemarketed_leads INT4,
    cost_per_telemarketed FLOAT8,
    other_leads INT4,
    cost_per_other FLOAT8,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id) NULL
);
ALTER TABLE lead_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_access_on_lead_analytics ON lead_analytics
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for Lead Analytics
CREATE INDEX idx_lead_analytics_user_id ON lead_analytics(user_id);
CREATE INDEX idx_lead_analytics_date_snapshot ON lead_analytics(date_snapshot);
CREATE INDEX idx_lead_analytics_lead_id ON lead_analytics(lead_id);

```

