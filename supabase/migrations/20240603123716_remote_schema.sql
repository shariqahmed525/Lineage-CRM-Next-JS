create extension if not exists "pg_trgm" with schema "public" version '1.6';

create sequence "public"."application_status_id_seq";

create sequence "public"."duplicates_duplicate_id_seq";

create sequence "public"."plan_coverage_type_id_seq";

create sequence "public"."plan_payment_day_id_seq";

create sequence "public"."plan_payment_method_id_seq";

create sequence "public"."plan_payment_mode_id_seq";

create sequence "public"."profile_id_seq";

create sequence "public"."twilio_subaccounts_id_seq";

create sequence "public"."upload_runs_upload_run_id_seq";

create table "public"."activity" (
    "activity_id" uuid not null default gen_random_uuid(),
    "lead_id" uuid,
    "action_type" text not null,
    "action_date" timestamp with time zone default now(),
    "created_by" uuid,
    "note" text,
    "old_lead_status_id" text,
    "new_lead_status_id" text,
    "activity_metadata" jsonb
);


create table "public"."agent_commission_rates" (
    "commission_id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "plan_id" uuid,
    "commission_rate" double precision not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."agent_commission_rates" enable row level security;

create table "public"."annual_goals" (
    "goal_id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "year" integer not null,
    "ap_goal" double precision not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."annual_goals" enable row level security;

create table "public"."application_history" (
    "history_id" uuid not null default gen_random_uuid(),
    "application_id" uuid,
    "changed_by" uuid,
    "change_description" text not null,
    "change_date" timestamp with time zone default now()
);


alter table "public"."application_history" enable row level security;

create table "public"."application_status" (
    "id" integer not null default nextval('application_status_id_seq'::regclass),
    "status_value" character varying(255) not null
);


create table "public"."applications" (
    "application_id" uuid not null default gen_random_uuid(),
    "lead_id" uuid,
    "application_date" date not null,
    "status" integer,
    "policy_number" character varying(255),
    "plan_id" uuid,
    "coverage_type" integer,
    "face_amount" double precision,
    "monthly_premium" double precision,
    "payment_mode" integer,
    "payment_method" integer,
    "payment_day" integer,
    "effective_date" date,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "additional_notes" text,
    "user_id" uuid,
    "replacing_existing_coverage" boolean,
    "effective_first_draft_date" date,
    "replaced_policy_number" character varying(255),
    "replaced_face_amount" character varying(255),
    "replaced_coverage_type" character varying(255),
    "replaced_premium_amount" character varying(255),
    "replaced_has_bank_draft_been_stopped" boolean,
    "carrier_1" uuid,
    "carrier_2" uuid,
    "replaced_carrier_1" uuid,
    "replaced_carrier_2" uuid,
    "carrier_plan_1" uuid,
    "carrier_plan_2" uuid,
    "has_bank_draft_been_stopped" boolean default false,
    "person_id" uuid,
    "age_on_effective_date" timestamp with time zone default now(),
    "age_on_replacement_date" timestamp with time zone default now(),
    "cancel_or_cash_in_date" timestamp with time zone default now()
);


alter table "public"."applications" enable row level security;

create table "public"."appointments" (
    "appointment_id" uuid not null default gen_random_uuid(),
    "lead_id" uuid,
    "user_id" uuid,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "title" text not null,
    "note" text,
    "google_event_id" text,
    "last_fetch" timestamp with time zone
);


alter table "public"."appointments" enable row level security;

create table "public"."callback_phone_numbers" (
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "phone_number" character varying default 'null'::character varying
);


alter table "public"."callback_phone_numbers" enable row level security;

create table "public"."carrier_plan_statuses" (
    "status_id" uuid not null default gen_random_uuid(),
    "status_name" character varying(255) not null,
    "description" text
);


create table "public"."carrier_plans" (
    "plan_id" uuid not null default gen_random_uuid(),
    "carrier_id" uuid,
    "status_id" uuid,
    "plan_name" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid,
    "plan_code" character varying(255),
    "default_commission_rate" double precision,
    "parent_code" character varying(255)
);


alter table "public"."carrier_plans" enable row level security;

create table "public"."carriers" (
    "carrier_id" uuid not null default gen_random_uuid(),
    "carrier_name" text not null,
    "parent_code" character varying(255) default NULL::character varying,
    "logo_url" text,
    "website" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid
);


alter table "public"."carriers" enable row level security;

create table "public"."counties" (
    "county_id" uuid not null default gen_random_uuid(),
    "county_name" text not null,
    "state_name" character varying(255) not null
);


create table "public"."duplicates" (
    "duplicate_id" integer not null default nextval('duplicates_duplicate_id_seq'::regclass),
    "upload_run_id" integer,
    "existing_lead_id" uuid,
    "duplicate_data" jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."filters" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "lead_statuses" uuid[] not null,
    "states" text[] not null,
    "counties" uuid[] not null,
    "cities" text[] not null,
    "zip_codes" text[] not null,
    "lead_sources" uuid[] not null
);


alter table "public"."filters" enable row level security;

create table "public"."incoming_calls" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "callback_number" character varying,
    "user_id" uuid default gen_random_uuid(),
    "call_details" jsonb
);


create table "public"."lead_analytics" (
    "analytic_id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "date_snapshot" date not null,
    "direct_mail_leads" integer,
    "cost_per_direct_mail" double precision,
    "telemarketed_leads" integer,
    "cost_per_telemarketed" double precision,
    "other_leads" integer,
    "cost_per_other" double precision,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "lead_id" uuid
);


alter table "public"."lead_analytics" enable row level security;

create table "public"."lead_sources" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "icon" text not null,
    "user_id" uuid,
    "is_default" boolean default false
);


alter table "public"."lead_sources" enable row level security;

create table "public"."lead_statuses" (
    "status_id" uuid not null default gen_random_uuid(),
    "status_name" text not null,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "badge_color_hexcode" text
);


alter table "public"."lead_statuses" enable row level security;

create table "public"."leads" (
    "id" uuid not null default gen_random_uuid(),
    "record_day" timestamp with time zone default now(),
    "user_id" uuid,
    "date_received" timestamp with time zone default now(),
    "lead_status_id" uuid,
    "lead_type" text,
    "quick_note" text,
    "attachment" text,
    "url_link" text,
    "date_created" timestamp with time zone default now(),
    "lead_source_id" uuid
);


alter table "public"."leads" enable row level security;

create table "public"."leads_locations" (
    "lead_id" uuid not null,
    "location_id" uuid not null,
    "user_id" uuid
);


alter table "public"."leads_locations" enable row level security;

create table "public"."leads_persons" (
    "lead_id" uuid not null,
    "person_id" uuid not null,
    "user_id" uuid
);


alter table "public"."leads_persons" enable row level security;

create table "public"."locations" (
    "location_id" uuid not null default gen_random_uuid(),
    "street_address" text,
    "street_address2" text,
    "city" text,
    "state_code" text,
    "zip" text,
    "county_id" uuid,
    "lat" numeric,
    "lng" numeric,
    "location_result_type" text,
    "user_id" uuid
);


create table "public"."notes" (
    "note_id" uuid not null default gen_random_uuid(),
    "lead_id" uuid,
    "note" text not null,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid
);


alter table "public"."notes" enable row level security;

create table "public"."persons" (
    "person_id" uuid not null default gen_random_uuid(),
    "first_name" text not null,
    "last_name" text not null,
    "spouse_name" text,
    "email_address" text,
    "user_id" uuid not null,
    "phone1" text,
    "phone2" text,
    "age" smallint,
    "called_phone1" boolean default false,
    "called_phone2" boolean default false,
    "spouse_age" integer
);


alter table "public"."persons" enable row level security;

create table "public"."plan_coverage_type" (
    "id" integer not null default nextval('plan_coverage_type_id_seq'::regclass),
    "coverage_type_value" character varying(255) not null
);


create table "public"."plan_payment_day" (
    "id" integer not null default nextval('plan_payment_day_id_seq'::regclass),
    "day_value" character varying(255) not null
);


create table "public"."plan_payment_method" (
    "id" integer not null default nextval('plan_payment_method_id_seq'::regclass),
    "method_value" character varying(255) not null
);


create table "public"."plan_payment_mode" (
    "id" integer not null default nextval('plan_payment_mode_id_seq'::regclass),
    "mode_value" character varying(255) not null
);


create table "public"."profile" (
    "id" integer not null default nextval('profile_id_seq'::regclass),
    "user_id" uuid not null,
    "session_data" jsonb not null,
    "user_data" jsonb not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "last_sync" timestamp with time zone,
    "stripe_checkout_session_id" character varying,
    "stripe_customer_id" character varying,
    "stripe_subscription_id" character varying,
    "subscription_status" character varying,
    "subscription_plan" character varying,
    "subscription_start_date" timestamp with time zone,
    "subscription_end_date" timestamp with time zone,
    "stripe_invoice_id" character varying,
    "last_payment_date" timestamp with time zone,
    "next_payment_due_date" timestamp with time zone,
    "last_payment_attempt_date" timestamp with time zone,
    "payment_failure_reason" character varying,
    "subscription_canceled_date" timestamp with time zone,
    "trial_end_date" timestamp with time zone,
    "email" character varying,
    "metadata" jsonb,
    "default_payment_method" character varying,
    "stripe_payment_intent_id" character varying,
    "payment_status" character varying,
    "payment_amount" integer,
    "payment_currency" character varying
);


alter table "public"."profile" enable row level security;

create table "public"."task_statuses" (
    "status_id" uuid not null default gen_random_uuid(),
    "status_name" text not null,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "badge_color_hexcode" text
);


alter table "public"."task_statuses" enable row level security;

create table "public"."tasks" (
    "task_id" uuid not null default gen_random_uuid(),
    "lead_id" uuid,
    "application_id" uuid,
    "assigned_to" uuid,
    "due_date" date not null,
    "task_description" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "task_status_id" uuid
);


alter table "public"."tasks" enable row level security;

create table "public"."team" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "email" text,
    "phone_number" text,
    "role" text,
    "permissions" jsonb,
    "status" text
);


alter table "public"."team" enable row level security;

create table "public"."twilio_subaccounts" (
    "id" integer not null default nextval('twilio_subaccounts_id_seq'::regclass),
    "user_id" uuid not null,
    "account_sid" character varying(34) not null,
    "auth_token" character varying(32) not null,
    "friendly_name" character varying(255),
    "date_created" timestamp with time zone,
    "date_updated" timestamp with time zone,
    "owner_account_sid" character varying(34),
    "status" character varying(50),
    "subresource_uris" jsonb,
    "type" character varying(50),
    "uri" character varying(255),
    "twiml_application" jsonb,
    "api_key" jsonb
);


alter table "public"."twilio_subaccounts" enable row level security;

create table "public"."upload_runs" (
    "upload_run_id" integer not null default nextval('upload_runs_upload_run_id_seq'::regclass),
    "timestamp" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_id" uuid,
    "file_path" text,
    "leads_processed" integer,
    "duplicates_found" integer,
    "status" text,
    "error_message" text,
    "updated_at" timestamp with time zone default now()
);


alter sequence "public"."application_status_id_seq" owned by "public"."application_status"."id";

alter sequence "public"."duplicates_duplicate_id_seq" owned by "public"."duplicates"."duplicate_id";

alter sequence "public"."plan_coverage_type_id_seq" owned by "public"."plan_coverage_type"."id";

alter sequence "public"."plan_payment_day_id_seq" owned by "public"."plan_payment_day"."id";

alter sequence "public"."plan_payment_method_id_seq" owned by "public"."plan_payment_method"."id";

alter sequence "public"."plan_payment_mode_id_seq" owned by "public"."plan_payment_mode"."id";

alter sequence "public"."profile_id_seq" owned by "public"."profile"."id";

alter sequence "public"."twilio_subaccounts_id_seq" owned by "public"."twilio_subaccounts"."id";

alter sequence "public"."upload_runs_upload_run_id_seq" owned by "public"."upload_runs"."upload_run_id";

CREATE UNIQUE INDEX activity_pkey ON public.activity USING btree (activity_id);

CREATE UNIQUE INDEX agent_commission_rates_pkey ON public.agent_commission_rates USING btree (commission_id);

CREATE UNIQUE INDEX annual_goals_pkey ON public.annual_goals USING btree (goal_id);

CREATE UNIQUE INDEX application_history_pkey ON public.application_history USING btree (history_id);

CREATE UNIQUE INDEX application_status_pkey ON public.application_status USING btree (id);

CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (application_id);

CREATE UNIQUE INDEX applications_policy_number_key ON public.applications USING btree (policy_number);

CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (appointment_id);

CREATE UNIQUE INDEX callback_numbers_pkey ON public.incoming_calls USING btree (id);

CREATE UNIQUE INDEX callback_phone_numbers_pkey ON public.callback_phone_numbers USING btree (user_id);

CREATE UNIQUE INDEX callback_phone_numbers_user_id_key ON public.callback_phone_numbers USING btree (user_id);

CREATE UNIQUE INDEX carrier_plan_statuses_pkey ON public.carrier_plan_statuses USING btree (status_id);

CREATE UNIQUE INDEX carrier_plans_pkey ON public.carrier_plans USING btree (plan_id);

CREATE UNIQUE INDEX carriers_pkey ON public.carriers USING btree (carrier_id);

CREATE UNIQUE INDEX counties_pkey ON public.counties USING btree (county_id);

CREATE UNIQUE INDEX duplicates_pkey ON public.duplicates USING btree (duplicate_id);

CREATE UNIQUE INDEX filters_pkey ON public.filters USING btree (id);

CREATE INDEX idx_agent_commission_rates_plan_id ON public.agent_commission_rates USING btree (plan_id);

CREATE INDEX idx_agent_commission_rates_user_id ON public.agent_commission_rates USING btree (user_id);

CREATE INDEX idx_annual_goals_user_id ON public.annual_goals USING btree (user_id);

CREATE INDEX idx_annual_goals_year ON public.annual_goals USING btree (year);

CREATE INDEX idx_application_history_application_id ON public.application_history USING btree (application_id);

CREATE INDEX idx_application_history_changed_by ON public.application_history USING btree (changed_by);

CREATE INDEX idx_applications_lead_id ON public.applications USING btree (lead_id);

CREATE INDEX idx_applications_plan_id ON public.applications USING btree (plan_id);

CREATE INDEX idx_applications_policy_number ON public.applications USING btree (policy_number);

CREATE INDEX idx_applications_status ON public.applications USING btree (status);

CREATE INDEX idx_carrier_plans_carrier_id ON public.carrier_plans USING btree (carrier_id);

CREATE INDEX idx_carrier_plans_status_id ON public.carrier_plans USING btree (status_id);

CREATE INDEX idx_lead_analytics_date_snapshot ON public.lead_analytics USING btree (date_snapshot);

CREATE INDEX idx_lead_analytics_lead_id ON public.lead_analytics USING btree (lead_id);

CREATE INDEX idx_lead_analytics_user_id ON public.lead_analytics USING btree (user_id);

CREATE INDEX idx_lead_statuses_created_by ON public.lead_statuses USING btree (created_by);

CREATE INDEX idx_leads_date_received ON public.leads USING btree (date_received);

CREATE INDEX idx_leads_lead_status_id ON public.leads USING btree (lead_status_id);

CREATE INDEX idx_leads_user_id ON public.leads USING btree (user_id);

CREATE INDEX idx_profile_user_id ON public.profile USING btree (user_id);

CREATE INDEX idx_task_statuses_created_by ON public.task_statuses USING btree (created_by);

CREATE INDEX idx_tasks_application_id ON public.tasks USING btree (application_id);

CREATE INDEX idx_tasks_assigned_to ON public.tasks USING btree (assigned_to);

CREATE INDEX idx_tasks_due_date ON public.tasks USING btree (due_date);

CREATE INDEX idx_tasks_lead_id ON public.tasks USING btree (lead_id);

CREATE INDEX idx_tasks_task_status_id ON public.tasks USING btree (task_status_id);

CREATE UNIQUE INDEX lead_analytics_pkey ON public.lead_analytics USING btree (analytic_id);

CREATE UNIQUE INDEX lead_sources_pkey ON public.lead_sources USING btree (id);

CREATE UNIQUE INDEX lead_statuses_pkey ON public.lead_statuses USING btree (status_id);

CREATE UNIQUE INDEX leads_locations_pkey ON public.leads_locations USING btree (lead_id, location_id);

CREATE UNIQUE INDEX leads_persons_pkey ON public.leads_persons USING btree (lead_id, person_id);

CREATE UNIQUE INDEX leads_pkey ON public.leads USING btree (id);

CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (location_id);

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (note_id);

CREATE UNIQUE INDEX persons_pkey ON public.persons USING btree (person_id);

CREATE UNIQUE INDEX plan_coverage_type_pkey ON public.plan_coverage_type USING btree (id);

CREATE UNIQUE INDEX plan_payment_day_pkey ON public.plan_payment_day USING btree (id);

CREATE UNIQUE INDEX plan_payment_method_pkey ON public.plan_payment_method USING btree (id);

CREATE UNIQUE INDEX plan_payment_mode_pkey ON public.plan_payment_mode USING btree (id);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX profile_user_id_key ON public.profile USING btree (user_id);

CREATE UNIQUE INDEX task_statuses_pkey ON public.task_statuses USING btree (status_id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (task_id);

CREATE UNIQUE INDEX team_id_key ON public.team USING btree (id);

CREATE UNIQUE INDEX team_pkey ON public.team USING btree (id);

CREATE UNIQUE INDEX twilio_subaccounts_pkey ON public.twilio_subaccounts USING btree (id);

CREATE UNIQUE INDEX twilio_subaccounts_user_id_key ON public.twilio_subaccounts USING btree (user_id);

CREATE UNIQUE INDEX upload_runs_pkey ON public.upload_runs USING btree (upload_run_id);

alter table "public"."activity" add constraint "activity_pkey" PRIMARY KEY using index "activity_pkey";

alter table "public"."agent_commission_rates" add constraint "agent_commission_rates_pkey" PRIMARY KEY using index "agent_commission_rates_pkey";

alter table "public"."annual_goals" add constraint "annual_goals_pkey" PRIMARY KEY using index "annual_goals_pkey";

alter table "public"."application_history" add constraint "application_history_pkey" PRIMARY KEY using index "application_history_pkey";

alter table "public"."application_status" add constraint "application_status_pkey" PRIMARY KEY using index "application_status_pkey";

alter table "public"."applications" add constraint "applications_pkey" PRIMARY KEY using index "applications_pkey";

alter table "public"."appointments" add constraint "appointments_pkey" PRIMARY KEY using index "appointments_pkey";

alter table "public"."callback_phone_numbers" add constraint "callback_phone_numbers_pkey" PRIMARY KEY using index "callback_phone_numbers_pkey";

alter table "public"."carrier_plan_statuses" add constraint "carrier_plan_statuses_pkey" PRIMARY KEY using index "carrier_plan_statuses_pkey";

alter table "public"."carrier_plans" add constraint "carrier_plans_pkey" PRIMARY KEY using index "carrier_plans_pkey";

alter table "public"."carriers" add constraint "carriers_pkey" PRIMARY KEY using index "carriers_pkey";

alter table "public"."counties" add constraint "counties_pkey" PRIMARY KEY using index "counties_pkey";

alter table "public"."duplicates" add constraint "duplicates_pkey" PRIMARY KEY using index "duplicates_pkey";

alter table "public"."filters" add constraint "filters_pkey" PRIMARY KEY using index "filters_pkey";

alter table "public"."incoming_calls" add constraint "callback_numbers_pkey" PRIMARY KEY using index "callback_numbers_pkey";

alter table "public"."lead_analytics" add constraint "lead_analytics_pkey" PRIMARY KEY using index "lead_analytics_pkey";

alter table "public"."lead_sources" add constraint "lead_sources_pkey" PRIMARY KEY using index "lead_sources_pkey";

alter table "public"."lead_statuses" add constraint "lead_statuses_pkey" PRIMARY KEY using index "lead_statuses_pkey";

alter table "public"."leads" add constraint "leads_pkey" PRIMARY KEY using index "leads_pkey";

alter table "public"."leads_locations" add constraint "leads_locations_pkey" PRIMARY KEY using index "leads_locations_pkey";

alter table "public"."leads_persons" add constraint "leads_persons_pkey" PRIMARY KEY using index "leads_persons_pkey";

alter table "public"."locations" add constraint "locations_pkey" PRIMARY KEY using index "locations_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."persons" add constraint "persons_pkey" PRIMARY KEY using index "persons_pkey";

alter table "public"."plan_coverage_type" add constraint "plan_coverage_type_pkey" PRIMARY KEY using index "plan_coverage_type_pkey";

alter table "public"."plan_payment_day" add constraint "plan_payment_day_pkey" PRIMARY KEY using index "plan_payment_day_pkey";

alter table "public"."plan_payment_method" add constraint "plan_payment_method_pkey" PRIMARY KEY using index "plan_payment_method_pkey";

alter table "public"."plan_payment_mode" add constraint "plan_payment_mode_pkey" PRIMARY KEY using index "plan_payment_mode_pkey";

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."task_statuses" add constraint "task_statuses_pkey" PRIMARY KEY using index "task_statuses_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."team" add constraint "team_pkey" PRIMARY KEY using index "team_pkey";

alter table "public"."twilio_subaccounts" add constraint "twilio_subaccounts_pkey" PRIMARY KEY using index "twilio_subaccounts_pkey";

alter table "public"."upload_runs" add constraint "upload_runs_pkey" PRIMARY KEY using index "upload_runs_pkey";

alter table "public"."activity" add constraint "public_activity_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."activity" validate constraint "public_activity_created_by_fkey";

alter table "public"."activity" add constraint "public_activity_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."activity" validate constraint "public_activity_lead_id_fkey";

alter table "public"."agent_commission_rates" add constraint "agent_commission_rates_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES carrier_plans(plan_id) not valid;

alter table "public"."agent_commission_rates" validate constraint "agent_commission_rates_plan_id_fkey";

alter table "public"."agent_commission_rates" add constraint "agent_commission_rates_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."agent_commission_rates" validate constraint "agent_commission_rates_user_id_fkey";

alter table "public"."annual_goals" add constraint "annual_goals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."annual_goals" validate constraint "annual_goals_user_id_fkey";

alter table "public"."application_history" add constraint "application_history_application_id_fkey" FOREIGN KEY (application_id) REFERENCES applications(application_id) not valid;

alter table "public"."application_history" validate constraint "application_history_application_id_fkey";

alter table "public"."application_history" add constraint "application_history_changed_by_fkey" FOREIGN KEY (changed_by) REFERENCES auth.users(id) not valid;

alter table "public"."application_history" validate constraint "application_history_changed_by_fkey";

alter table "public"."applications" add constraint "applications_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_lead_id_fkey";

alter table "public"."applications" add constraint "applications_person_id_fkey" FOREIGN KEY (person_id) REFERENCES persons(person_id) not valid;

alter table "public"."applications" validate constraint "applications_person_id_fkey";

alter table "public"."applications" add constraint "applications_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES carrier_plans(plan_id) not valid;

alter table "public"."applications" validate constraint "applications_plan_id_fkey";

alter table "public"."applications" add constraint "applications_policy_number_key" UNIQUE using index "applications_policy_number_key";

alter table "public"."applications" add constraint "applications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."applications" validate constraint "applications_user_id_fkey";

alter table "public"."applications" add constraint "fk_applications_carrier_1" FOREIGN KEY (carrier_1) REFERENCES carriers(carrier_id) not valid;

alter table "public"."applications" validate constraint "fk_applications_carrier_1";

alter table "public"."applications" add constraint "fk_applications_carrier_2" FOREIGN KEY (carrier_2) REFERENCES carriers(carrier_id) not valid;

alter table "public"."applications" validate constraint "fk_applications_carrier_2";

alter table "public"."applications" add constraint "fk_applications_carrier_plan_1" FOREIGN KEY (carrier_plan_1) REFERENCES carrier_plans(plan_id) not valid;

alter table "public"."applications" validate constraint "fk_applications_carrier_plan_1";

alter table "public"."applications" add constraint "fk_applications_carrier_plan_2" FOREIGN KEY (carrier_plan_2) REFERENCES carrier_plans(plan_id) not valid;

alter table "public"."applications" validate constraint "fk_applications_carrier_plan_2";

alter table "public"."applications" add constraint "fk_applications_coverage_type" FOREIGN KEY (coverage_type) REFERENCES plan_coverage_type(id) not valid;

alter table "public"."applications" validate constraint "fk_applications_coverage_type";

alter table "public"."applications" add constraint "fk_applications_payment_day" FOREIGN KEY (payment_day) REFERENCES plan_payment_day(id) not valid;

alter table "public"."applications" validate constraint "fk_applications_payment_day";

alter table "public"."applications" add constraint "fk_applications_payment_method" FOREIGN KEY (payment_method) REFERENCES plan_payment_method(id) not valid;

alter table "public"."applications" validate constraint "fk_applications_payment_method";

alter table "public"."applications" add constraint "fk_applications_payment_mode" FOREIGN KEY (payment_mode) REFERENCES plan_payment_mode(id) not valid;

alter table "public"."applications" validate constraint "fk_applications_payment_mode";

alter table "public"."applications" add constraint "fk_applications_replaced_carrier_1" FOREIGN KEY (replaced_carrier_1) REFERENCES carriers(carrier_id) not valid;

alter table "public"."applications" validate constraint "fk_applications_replaced_carrier_1";

alter table "public"."applications" add constraint "fk_applications_replaced_carrier_2" FOREIGN KEY (replaced_carrier_2) REFERENCES carriers(carrier_id) not valid;

alter table "public"."applications" validate constraint "fk_applications_replaced_carrier_2";

alter table "public"."applications" add constraint "fk_applications_status" FOREIGN KEY (status) REFERENCES application_status(id) not valid;

alter table "public"."applications" validate constraint "fk_applications_status";

alter table "public"."appointments" add constraint "appointments_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) not valid;

alter table "public"."appointments" validate constraint "appointments_lead_id_fkey";

alter table "public"."appointments" add constraint "appointments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."appointments" validate constraint "appointments_user_id_fkey";

alter table "public"."callback_phone_numbers" add constraint "callback_phone_numbers_user_id_key" UNIQUE using index "callback_phone_numbers_user_id_key";

alter table "public"."callback_phone_numbers" add constraint "public_callback_phone_numbers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."callback_phone_numbers" validate constraint "public_callback_phone_numbers_user_id_fkey";

alter table "public"."carrier_plans" add constraint "carrier_plans_carrier_id_fkey" FOREIGN KEY (carrier_id) REFERENCES carriers(carrier_id) not valid;

alter table "public"."carrier_plans" validate constraint "carrier_plans_carrier_id_fkey";

alter table "public"."carrier_plans" add constraint "carrier_plans_default_commission_rate_check" CHECK ((default_commission_rate > (0)::double precision)) not valid;

alter table "public"."carrier_plans" validate constraint "carrier_plans_default_commission_rate_check";

alter table "public"."carrier_plans" add constraint "carrier_plans_status_id_fkey" FOREIGN KEY (status_id) REFERENCES carrier_plan_statuses(status_id) not valid;

alter table "public"."carrier_plans" validate constraint "carrier_plans_status_id_fkey";

alter table "public"."carrier_plans" add constraint "fk_carrier_plans_user_id" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."carrier_plans" validate constraint "fk_carrier_plans_user_id";

alter table "public"."carriers" add constraint "fk_carriers_user_id" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."carriers" validate constraint "fk_carriers_user_id";

alter table "public"."duplicates" add constraint "duplicates_existing_lead_id_fkey" FOREIGN KEY (existing_lead_id) REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."duplicates" validate constraint "duplicates_existing_lead_id_fkey";

alter table "public"."duplicates" add constraint "duplicates_upload_run_id_fkey" FOREIGN KEY (upload_run_id) REFERENCES upload_runs(upload_run_id) not valid;

alter table "public"."duplicates" validate constraint "duplicates_upload_run_id_fkey";

alter table "public"."filters" add constraint "filters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."filters" validate constraint "filters_user_id_fkey";

alter table "public"."incoming_calls" add constraint "public_callback_numbers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."incoming_calls" validate constraint "public_callback_numbers_user_id_fkey";

alter table "public"."lead_analytics" add constraint "lead_analytics_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) not valid;

alter table "public"."lead_analytics" validate constraint "lead_analytics_lead_id_fkey";

alter table "public"."lead_analytics" add constraint "lead_analytics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."lead_analytics" validate constraint "lead_analytics_user_id_fkey";

alter table "public"."lead_statuses" add constraint "lead_statuses_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."lead_statuses" validate constraint "lead_statuses_created_by_fkey";

alter table "public"."leads" add constraint "leads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."leads" validate constraint "leads_user_id_fkey";

alter table "public"."leads" add constraint "public_leads_lead_source_id_fkey" FOREIGN KEY (lead_source_id) REFERENCES lead_sources(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."leads" validate constraint "public_leads_lead_source_id_fkey";

alter table "public"."leads" add constraint "public_leads_lead_status_id_fkey" FOREIGN KEY (lead_status_id) REFERENCES lead_statuses(status_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."leads" validate constraint "public_leads_lead_status_id_fkey";

alter table "public"."leads_locations" add constraint "leads_locations_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE not valid;

alter table "public"."leads_locations" validate constraint "leads_locations_lead_id_fkey";

alter table "public"."leads_locations" add constraint "leads_locations_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE not valid;

alter table "public"."leads_locations" validate constraint "leads_locations_location_id_fkey";

alter table "public"."leads_locations" add constraint "leads_locations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."leads_locations" validate constraint "leads_locations_user_id_fkey";

alter table "public"."leads_persons" add constraint "leads_persons_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE not valid;

alter table "public"."leads_persons" validate constraint "leads_persons_lead_id_fkey";

alter table "public"."leads_persons" add constraint "leads_persons_person_id_fkey" FOREIGN KEY (person_id) REFERENCES persons(person_id) ON DELETE CASCADE not valid;

alter table "public"."leads_persons" validate constraint "leads_persons_person_id_fkey";

alter table "public"."leads_persons" add constraint "leads_persons_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."leads_persons" validate constraint "leads_persons_user_id_fkey";

alter table "public"."locations" add constraint "locations_county_id_fkey" FOREIGN KEY (county_id) REFERENCES counties(county_id) not valid;

alter table "public"."locations" validate constraint "locations_county_id_fkey";

alter table "public"."locations" add constraint "locations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."locations" validate constraint "locations_user_id_fkey";

alter table "public"."notes" add constraint "notes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."notes" validate constraint "notes_created_by_fkey";

alter table "public"."notes" add constraint "notes_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) not valid;

alter table "public"."notes" validate constraint "notes_lead_id_fkey";

alter table "public"."persons" add constraint "persons_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."persons" validate constraint "persons_user_id_fkey";

alter table "public"."profile" add constraint "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_user_id_fkey";

alter table "public"."profile" add constraint "profile_user_id_key" UNIQUE using index "profile_user_id_key";

alter table "public"."task_statuses" add constraint "task_statuses_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."task_statuses" validate constraint "task_statuses_created_by_fkey";

alter table "public"."tasks" add constraint "tasks_application_id_fkey" FOREIGN KEY (application_id) REFERENCES applications(application_id) not valid;

alter table "public"."tasks" validate constraint "tasks_application_id_fkey";

alter table "public"."tasks" add constraint "tasks_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES auth.users(id) not valid;

alter table "public"."tasks" validate constraint "tasks_assigned_to_fkey";

alter table "public"."tasks" add constraint "tasks_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) not valid;

alter table "public"."tasks" validate constraint "tasks_lead_id_fkey";

alter table "public"."tasks" add constraint "tasks_task_status_id_fkey" FOREIGN KEY (task_status_id) REFERENCES task_statuses(status_id) not valid;

alter table "public"."tasks" validate constraint "tasks_task_status_id_fkey";

alter table "public"."team" add constraint "team_id_key" UNIQUE using index "team_id_key";

alter table "public"."twilio_subaccounts" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."twilio_subaccounts" validate constraint "fk_user";

alter table "public"."twilio_subaccounts" add constraint "twilio_subaccounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."twilio_subaccounts" validate constraint "twilio_subaccounts_user_id_fkey";

alter table "public"."twilio_subaccounts" add constraint "twilio_subaccounts_user_id_key" UNIQUE using index "twilio_subaccounts_user_id_key";

alter table "public"."upload_runs" add constraint "upload_runs_status_check" CHECK ((status = ANY (ARRAY['success'::text, 'failed'::text, 'partial'::text]))) not valid;

alter table "public"."upload_runs" validate constraint "upload_runs_status_check";

alter table "public"."upload_runs" add constraint "upload_runs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."upload_runs" validate constraint "upload_runs_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.log_lead_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF OLD.lead_status_id IS DISTINCT FROM NEW.lead_status_id THEN
        INSERT INTO public.activity (action_date, action_type, lead_id, created_by, old_lead_status_id, new_lead_status_id)
        VALUES (NOW(), 'Change Lead Status', NEW.id, NEW.user_id, OLD.lead_status_id, NEW.lead_status_id);
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.refresh_search_leads()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.search_leads;
    RETURN NULL;
END;
$function$
;

create materialized view "public"."search_leads" as  SELECT l.id AS lead_id,
    array_agg(DISTINCT ((((((((p.first_name || ' '::text) || p.last_name) || ' '::text) || p.phone1) || ' '::text) || p.phone2) || ' '::text) || p.email_address)) AS person_details,
    array_agg(DISTINCT ((((((((((((loc.street_address || ' '::text) || loc.city) || ' '::text) || loc.state_code) || ' '::text) || loc.zip) || ' '::text) || (loc.county_id)::text) || ' '::text) || (loc.lat)::text) || ' '::text) || (loc.lng)::text)) AS location_details,
    to_tsvector('english'::regconfig, ((array_to_string(array_agg(DISTINCT ((((((((p.first_name || ' '::text) || p.last_name) || ' '::text) || p.phone1) || ' '::text) || p.phone2) || ' '::text) || p.email_address)), ' '::text) || ' '::text) || array_to_string(array_agg(DISTINCT ((((((((((((loc.street_address || ' '::text) || loc.city) || ' '::text) || loc.state_code) || ' '::text) || loc.zip) || ' '::text) || (loc.county_id)::text) || ' '::text) || (loc.lat)::text) || ' '::text) || (loc.lng)::text)), ' '::text))) AS fts
   FROM ((((leads l
     JOIN leads_persons lp ON ((l.id = lp.lead_id)))
     JOIN persons p ON ((lp.person_id = p.person_id)))
     JOIN leads_locations ll ON ((l.id = ll.lead_id)))
     JOIN locations loc ON ((ll.location_id = loc.location_id)))
  GROUP BY l.id;


CREATE INDEX search_leads_fts ON public.search_leads USING gin (fts);

CREATE UNIQUE INDEX search_leads_lead_id_idx ON public.search_leads USING btree (lead_id);

grant delete on table "public"."activity" to "anon";

grant insert on table "public"."activity" to "anon";

grant references on table "public"."activity" to "anon";

grant select on table "public"."activity" to "anon";

grant trigger on table "public"."activity" to "anon";

grant truncate on table "public"."activity" to "anon";

grant update on table "public"."activity" to "anon";

grant delete on table "public"."activity" to "authenticated";

grant insert on table "public"."activity" to "authenticated";

grant references on table "public"."activity" to "authenticated";

grant select on table "public"."activity" to "authenticated";

grant trigger on table "public"."activity" to "authenticated";

grant truncate on table "public"."activity" to "authenticated";

grant update on table "public"."activity" to "authenticated";

grant delete on table "public"."activity" to "service_role";

grant insert on table "public"."activity" to "service_role";

grant references on table "public"."activity" to "service_role";

grant select on table "public"."activity" to "service_role";

grant trigger on table "public"."activity" to "service_role";

grant truncate on table "public"."activity" to "service_role";

grant update on table "public"."activity" to "service_role";

grant delete on table "public"."agent_commission_rates" to "anon";

grant insert on table "public"."agent_commission_rates" to "anon";

grant references on table "public"."agent_commission_rates" to "anon";

grant select on table "public"."agent_commission_rates" to "anon";

grant trigger on table "public"."agent_commission_rates" to "anon";

grant truncate on table "public"."agent_commission_rates" to "anon";

grant update on table "public"."agent_commission_rates" to "anon";

grant delete on table "public"."agent_commission_rates" to "authenticated";

grant insert on table "public"."agent_commission_rates" to "authenticated";

grant references on table "public"."agent_commission_rates" to "authenticated";

grant select on table "public"."agent_commission_rates" to "authenticated";

grant trigger on table "public"."agent_commission_rates" to "authenticated";

grant truncate on table "public"."agent_commission_rates" to "authenticated";

grant update on table "public"."agent_commission_rates" to "authenticated";

grant delete on table "public"."agent_commission_rates" to "service_role";

grant insert on table "public"."agent_commission_rates" to "service_role";

grant references on table "public"."agent_commission_rates" to "service_role";

grant select on table "public"."agent_commission_rates" to "service_role";

grant trigger on table "public"."agent_commission_rates" to "service_role";

grant truncate on table "public"."agent_commission_rates" to "service_role";

grant update on table "public"."agent_commission_rates" to "service_role";

grant delete on table "public"."annual_goals" to "anon";

grant insert on table "public"."annual_goals" to "anon";

grant references on table "public"."annual_goals" to "anon";

grant select on table "public"."annual_goals" to "anon";

grant trigger on table "public"."annual_goals" to "anon";

grant truncate on table "public"."annual_goals" to "anon";

grant update on table "public"."annual_goals" to "anon";

grant delete on table "public"."annual_goals" to "authenticated";

grant insert on table "public"."annual_goals" to "authenticated";

grant references on table "public"."annual_goals" to "authenticated";

grant select on table "public"."annual_goals" to "authenticated";

grant trigger on table "public"."annual_goals" to "authenticated";

grant truncate on table "public"."annual_goals" to "authenticated";

grant update on table "public"."annual_goals" to "authenticated";

grant delete on table "public"."annual_goals" to "service_role";

grant insert on table "public"."annual_goals" to "service_role";

grant references on table "public"."annual_goals" to "service_role";

grant select on table "public"."annual_goals" to "service_role";

grant trigger on table "public"."annual_goals" to "service_role";

grant truncate on table "public"."annual_goals" to "service_role";

grant update on table "public"."annual_goals" to "service_role";

grant delete on table "public"."application_history" to "anon";

grant insert on table "public"."application_history" to "anon";

grant references on table "public"."application_history" to "anon";

grant select on table "public"."application_history" to "anon";

grant trigger on table "public"."application_history" to "anon";

grant truncate on table "public"."application_history" to "anon";

grant update on table "public"."application_history" to "anon";

grant delete on table "public"."application_history" to "authenticated";

grant insert on table "public"."application_history" to "authenticated";

grant references on table "public"."application_history" to "authenticated";

grant select on table "public"."application_history" to "authenticated";

grant trigger on table "public"."application_history" to "authenticated";

grant truncate on table "public"."application_history" to "authenticated";

grant update on table "public"."application_history" to "authenticated";

grant delete on table "public"."application_history" to "service_role";

grant insert on table "public"."application_history" to "service_role";

grant references on table "public"."application_history" to "service_role";

grant select on table "public"."application_history" to "service_role";

grant trigger on table "public"."application_history" to "service_role";

grant truncate on table "public"."application_history" to "service_role";

grant update on table "public"."application_history" to "service_role";

grant delete on table "public"."application_status" to "anon";

grant insert on table "public"."application_status" to "anon";

grant references on table "public"."application_status" to "anon";

grant select on table "public"."application_status" to "anon";

grant trigger on table "public"."application_status" to "anon";

grant truncate on table "public"."application_status" to "anon";

grant update on table "public"."application_status" to "anon";

grant delete on table "public"."application_status" to "authenticated";

grant insert on table "public"."application_status" to "authenticated";

grant references on table "public"."application_status" to "authenticated";

grant select on table "public"."application_status" to "authenticated";

grant trigger on table "public"."application_status" to "authenticated";

grant truncate on table "public"."application_status" to "authenticated";

grant update on table "public"."application_status" to "authenticated";

grant delete on table "public"."application_status" to "service_role";

grant insert on table "public"."application_status" to "service_role";

grant references on table "public"."application_status" to "service_role";

grant select on table "public"."application_status" to "service_role";

grant trigger on table "public"."application_status" to "service_role";

grant truncate on table "public"."application_status" to "service_role";

grant update on table "public"."application_status" to "service_role";

grant delete on table "public"."applications" to "anon";

grant insert on table "public"."applications" to "anon";

grant references on table "public"."applications" to "anon";

grant select on table "public"."applications" to "anon";

grant trigger on table "public"."applications" to "anon";

grant truncate on table "public"."applications" to "anon";

grant update on table "public"."applications" to "anon";

grant delete on table "public"."applications" to "authenticated";

grant insert on table "public"."applications" to "authenticated";

grant references on table "public"."applications" to "authenticated";

grant select on table "public"."applications" to "authenticated";

grant trigger on table "public"."applications" to "authenticated";

grant truncate on table "public"."applications" to "authenticated";

grant update on table "public"."applications" to "authenticated";

grant delete on table "public"."applications" to "service_role";

grant insert on table "public"."applications" to "service_role";

grant references on table "public"."applications" to "service_role";

grant select on table "public"."applications" to "service_role";

grant trigger on table "public"."applications" to "service_role";

grant truncate on table "public"."applications" to "service_role";

grant update on table "public"."applications" to "service_role";

grant delete on table "public"."appointments" to "anon";

grant insert on table "public"."appointments" to "anon";

grant references on table "public"."appointments" to "anon";

grant select on table "public"."appointments" to "anon";

grant trigger on table "public"."appointments" to "anon";

grant truncate on table "public"."appointments" to "anon";

grant update on table "public"."appointments" to "anon";

grant delete on table "public"."appointments" to "authenticated";

grant insert on table "public"."appointments" to "authenticated";

grant references on table "public"."appointments" to "authenticated";

grant select on table "public"."appointments" to "authenticated";

grant trigger on table "public"."appointments" to "authenticated";

grant truncate on table "public"."appointments" to "authenticated";

grant update on table "public"."appointments" to "authenticated";

grant delete on table "public"."appointments" to "service_role";

grant insert on table "public"."appointments" to "service_role";

grant references on table "public"."appointments" to "service_role";

grant select on table "public"."appointments" to "service_role";

grant trigger on table "public"."appointments" to "service_role";

grant truncate on table "public"."appointments" to "service_role";

grant update on table "public"."appointments" to "service_role";

grant delete on table "public"."callback_phone_numbers" to "anon";

grant insert on table "public"."callback_phone_numbers" to "anon";

grant references on table "public"."callback_phone_numbers" to "anon";

grant select on table "public"."callback_phone_numbers" to "anon";

grant trigger on table "public"."callback_phone_numbers" to "anon";

grant truncate on table "public"."callback_phone_numbers" to "anon";

grant update on table "public"."callback_phone_numbers" to "anon";

grant delete on table "public"."callback_phone_numbers" to "authenticated";

grant insert on table "public"."callback_phone_numbers" to "authenticated";

grant references on table "public"."callback_phone_numbers" to "authenticated";

grant select on table "public"."callback_phone_numbers" to "authenticated";

grant trigger on table "public"."callback_phone_numbers" to "authenticated";

grant truncate on table "public"."callback_phone_numbers" to "authenticated";

grant update on table "public"."callback_phone_numbers" to "authenticated";

grant delete on table "public"."callback_phone_numbers" to "service_role";

grant insert on table "public"."callback_phone_numbers" to "service_role";

grant references on table "public"."callback_phone_numbers" to "service_role";

grant select on table "public"."callback_phone_numbers" to "service_role";

grant trigger on table "public"."callback_phone_numbers" to "service_role";

grant truncate on table "public"."callback_phone_numbers" to "service_role";

grant update on table "public"."callback_phone_numbers" to "service_role";

grant delete on table "public"."carrier_plan_statuses" to "anon";

grant insert on table "public"."carrier_plan_statuses" to "anon";

grant references on table "public"."carrier_plan_statuses" to "anon";

grant select on table "public"."carrier_plan_statuses" to "anon";

grant trigger on table "public"."carrier_plan_statuses" to "anon";

grant truncate on table "public"."carrier_plan_statuses" to "anon";

grant update on table "public"."carrier_plan_statuses" to "anon";

grant delete on table "public"."carrier_plan_statuses" to "authenticated";

grant insert on table "public"."carrier_plan_statuses" to "authenticated";

grant references on table "public"."carrier_plan_statuses" to "authenticated";

grant select on table "public"."carrier_plan_statuses" to "authenticated";

grant trigger on table "public"."carrier_plan_statuses" to "authenticated";

grant truncate on table "public"."carrier_plan_statuses" to "authenticated";

grant update on table "public"."carrier_plan_statuses" to "authenticated";

grant delete on table "public"."carrier_plan_statuses" to "service_role";

grant insert on table "public"."carrier_plan_statuses" to "service_role";

grant references on table "public"."carrier_plan_statuses" to "service_role";

grant select on table "public"."carrier_plan_statuses" to "service_role";

grant trigger on table "public"."carrier_plan_statuses" to "service_role";

grant truncate on table "public"."carrier_plan_statuses" to "service_role";

grant update on table "public"."carrier_plan_statuses" to "service_role";

grant delete on table "public"."carrier_plans" to "anon";

grant insert on table "public"."carrier_plans" to "anon";

grant references on table "public"."carrier_plans" to "anon";

grant select on table "public"."carrier_plans" to "anon";

grant trigger on table "public"."carrier_plans" to "anon";

grant truncate on table "public"."carrier_plans" to "anon";

grant update on table "public"."carrier_plans" to "anon";

grant delete on table "public"."carrier_plans" to "authenticated";

grant insert on table "public"."carrier_plans" to "authenticated";

grant references on table "public"."carrier_plans" to "authenticated";

grant select on table "public"."carrier_plans" to "authenticated";

grant trigger on table "public"."carrier_plans" to "authenticated";

grant truncate on table "public"."carrier_plans" to "authenticated";

grant update on table "public"."carrier_plans" to "authenticated";

grant delete on table "public"."carrier_plans" to "service_role";

grant insert on table "public"."carrier_plans" to "service_role";

grant references on table "public"."carrier_plans" to "service_role";

grant select on table "public"."carrier_plans" to "service_role";

grant trigger on table "public"."carrier_plans" to "service_role";

grant truncate on table "public"."carrier_plans" to "service_role";

grant update on table "public"."carrier_plans" to "service_role";

grant delete on table "public"."carriers" to "anon";

grant insert on table "public"."carriers" to "anon";

grant references on table "public"."carriers" to "anon";

grant select on table "public"."carriers" to "anon";

grant trigger on table "public"."carriers" to "anon";

grant truncate on table "public"."carriers" to "anon";

grant update on table "public"."carriers" to "anon";

grant delete on table "public"."carriers" to "authenticated";

grant insert on table "public"."carriers" to "authenticated";

grant references on table "public"."carriers" to "authenticated";

grant select on table "public"."carriers" to "authenticated";

grant trigger on table "public"."carriers" to "authenticated";

grant truncate on table "public"."carriers" to "authenticated";

grant update on table "public"."carriers" to "authenticated";

grant delete on table "public"."carriers" to "service_role";

grant insert on table "public"."carriers" to "service_role";

grant references on table "public"."carriers" to "service_role";

grant select on table "public"."carriers" to "service_role";

grant trigger on table "public"."carriers" to "service_role";

grant truncate on table "public"."carriers" to "service_role";

grant update on table "public"."carriers" to "service_role";

grant delete on table "public"."counties" to "anon";

grant insert on table "public"."counties" to "anon";

grant references on table "public"."counties" to "anon";

grant select on table "public"."counties" to "anon";

grant trigger on table "public"."counties" to "anon";

grant truncate on table "public"."counties" to "anon";

grant update on table "public"."counties" to "anon";

grant delete on table "public"."counties" to "authenticated";

grant insert on table "public"."counties" to "authenticated";

grant references on table "public"."counties" to "authenticated";

grant select on table "public"."counties" to "authenticated";

grant trigger on table "public"."counties" to "authenticated";

grant truncate on table "public"."counties" to "authenticated";

grant update on table "public"."counties" to "authenticated";

grant delete on table "public"."counties" to "service_role";

grant insert on table "public"."counties" to "service_role";

grant references on table "public"."counties" to "service_role";

grant select on table "public"."counties" to "service_role";

grant trigger on table "public"."counties" to "service_role";

grant truncate on table "public"."counties" to "service_role";

grant update on table "public"."counties" to "service_role";

grant delete on table "public"."duplicates" to "anon";

grant insert on table "public"."duplicates" to "anon";

grant references on table "public"."duplicates" to "anon";

grant select on table "public"."duplicates" to "anon";

grant trigger on table "public"."duplicates" to "anon";

grant truncate on table "public"."duplicates" to "anon";

grant update on table "public"."duplicates" to "anon";

grant delete on table "public"."duplicates" to "authenticated";

grant insert on table "public"."duplicates" to "authenticated";

grant references on table "public"."duplicates" to "authenticated";

grant select on table "public"."duplicates" to "authenticated";

grant trigger on table "public"."duplicates" to "authenticated";

grant truncate on table "public"."duplicates" to "authenticated";

grant update on table "public"."duplicates" to "authenticated";

grant delete on table "public"."duplicates" to "service_role";

grant insert on table "public"."duplicates" to "service_role";

grant references on table "public"."duplicates" to "service_role";

grant select on table "public"."duplicates" to "service_role";

grant trigger on table "public"."duplicates" to "service_role";

grant truncate on table "public"."duplicates" to "service_role";

grant update on table "public"."duplicates" to "service_role";

grant delete on table "public"."filters" to "anon";

grant insert on table "public"."filters" to "anon";

grant references on table "public"."filters" to "anon";

grant select on table "public"."filters" to "anon";

grant trigger on table "public"."filters" to "anon";

grant truncate on table "public"."filters" to "anon";

grant update on table "public"."filters" to "anon";

grant delete on table "public"."filters" to "authenticated";

grant insert on table "public"."filters" to "authenticated";

grant references on table "public"."filters" to "authenticated";

grant select on table "public"."filters" to "authenticated";

grant trigger on table "public"."filters" to "authenticated";

grant truncate on table "public"."filters" to "authenticated";

grant update on table "public"."filters" to "authenticated";

grant delete on table "public"."filters" to "service_role";

grant insert on table "public"."filters" to "service_role";

grant references on table "public"."filters" to "service_role";

grant select on table "public"."filters" to "service_role";

grant trigger on table "public"."filters" to "service_role";

grant truncate on table "public"."filters" to "service_role";

grant update on table "public"."filters" to "service_role";

grant delete on table "public"."incoming_calls" to "anon";

grant insert on table "public"."incoming_calls" to "anon";

grant references on table "public"."incoming_calls" to "anon";

grant select on table "public"."incoming_calls" to "anon";

grant trigger on table "public"."incoming_calls" to "anon";

grant truncate on table "public"."incoming_calls" to "anon";

grant update on table "public"."incoming_calls" to "anon";

grant delete on table "public"."incoming_calls" to "authenticated";

grant insert on table "public"."incoming_calls" to "authenticated";

grant references on table "public"."incoming_calls" to "authenticated";

grant select on table "public"."incoming_calls" to "authenticated";

grant trigger on table "public"."incoming_calls" to "authenticated";

grant truncate on table "public"."incoming_calls" to "authenticated";

grant update on table "public"."incoming_calls" to "authenticated";

grant delete on table "public"."incoming_calls" to "service_role";

grant insert on table "public"."incoming_calls" to "service_role";

grant references on table "public"."incoming_calls" to "service_role";

grant select on table "public"."incoming_calls" to "service_role";

grant trigger on table "public"."incoming_calls" to "service_role";

grant truncate on table "public"."incoming_calls" to "service_role";

grant update on table "public"."incoming_calls" to "service_role";

grant delete on table "public"."lead_analytics" to "anon";

grant insert on table "public"."lead_analytics" to "anon";

grant references on table "public"."lead_analytics" to "anon";

grant select on table "public"."lead_analytics" to "anon";

grant trigger on table "public"."lead_analytics" to "anon";

grant truncate on table "public"."lead_analytics" to "anon";

grant update on table "public"."lead_analytics" to "anon";

grant delete on table "public"."lead_analytics" to "authenticated";

grant insert on table "public"."lead_analytics" to "authenticated";

grant references on table "public"."lead_analytics" to "authenticated";

grant select on table "public"."lead_analytics" to "authenticated";

grant trigger on table "public"."lead_analytics" to "authenticated";

grant truncate on table "public"."lead_analytics" to "authenticated";

grant update on table "public"."lead_analytics" to "authenticated";

grant delete on table "public"."lead_analytics" to "service_role";

grant insert on table "public"."lead_analytics" to "service_role";

grant references on table "public"."lead_analytics" to "service_role";

grant select on table "public"."lead_analytics" to "service_role";

grant trigger on table "public"."lead_analytics" to "service_role";

grant truncate on table "public"."lead_analytics" to "service_role";

grant update on table "public"."lead_analytics" to "service_role";

grant delete on table "public"."lead_sources" to "anon";

grant insert on table "public"."lead_sources" to "anon";

grant references on table "public"."lead_sources" to "anon";

grant select on table "public"."lead_sources" to "anon";

grant trigger on table "public"."lead_sources" to "anon";

grant truncate on table "public"."lead_sources" to "anon";

grant update on table "public"."lead_sources" to "anon";

grant delete on table "public"."lead_sources" to "authenticated";

grant insert on table "public"."lead_sources" to "authenticated";

grant references on table "public"."lead_sources" to "authenticated";

grant select on table "public"."lead_sources" to "authenticated";

grant trigger on table "public"."lead_sources" to "authenticated";

grant truncate on table "public"."lead_sources" to "authenticated";

grant update on table "public"."lead_sources" to "authenticated";

grant delete on table "public"."lead_sources" to "service_role";

grant insert on table "public"."lead_sources" to "service_role";

grant references on table "public"."lead_sources" to "service_role";

grant select on table "public"."lead_sources" to "service_role";

grant trigger on table "public"."lead_sources" to "service_role";

grant truncate on table "public"."lead_sources" to "service_role";

grant update on table "public"."lead_sources" to "service_role";

grant delete on table "public"."lead_statuses" to "anon";

grant insert on table "public"."lead_statuses" to "anon";

grant references on table "public"."lead_statuses" to "anon";

grant select on table "public"."lead_statuses" to "anon";

grant trigger on table "public"."lead_statuses" to "anon";

grant truncate on table "public"."lead_statuses" to "anon";

grant update on table "public"."lead_statuses" to "anon";

grant delete on table "public"."lead_statuses" to "authenticated";

grant insert on table "public"."lead_statuses" to "authenticated";

grant references on table "public"."lead_statuses" to "authenticated";

grant select on table "public"."lead_statuses" to "authenticated";

grant trigger on table "public"."lead_statuses" to "authenticated";

grant truncate on table "public"."lead_statuses" to "authenticated";

grant update on table "public"."lead_statuses" to "authenticated";

grant delete on table "public"."lead_statuses" to "service_role";

grant insert on table "public"."lead_statuses" to "service_role";

grant references on table "public"."lead_statuses" to "service_role";

grant select on table "public"."lead_statuses" to "service_role";

grant trigger on table "public"."lead_statuses" to "service_role";

grant truncate on table "public"."lead_statuses" to "service_role";

grant update on table "public"."lead_statuses" to "service_role";

grant delete on table "public"."leads" to "anon";

grant insert on table "public"."leads" to "anon";

grant references on table "public"."leads" to "anon";

grant select on table "public"."leads" to "anon";

grant trigger on table "public"."leads" to "anon";

grant truncate on table "public"."leads" to "anon";

grant update on table "public"."leads" to "anon";

grant delete on table "public"."leads" to "authenticated";

grant insert on table "public"."leads" to "authenticated";

grant references on table "public"."leads" to "authenticated";

grant select on table "public"."leads" to "authenticated";

grant trigger on table "public"."leads" to "authenticated";

grant truncate on table "public"."leads" to "authenticated";

grant update on table "public"."leads" to "authenticated";

grant delete on table "public"."leads" to "service_role";

grant insert on table "public"."leads" to "service_role";

grant references on table "public"."leads" to "service_role";

grant select on table "public"."leads" to "service_role";

grant trigger on table "public"."leads" to "service_role";

grant truncate on table "public"."leads" to "service_role";

grant update on table "public"."leads" to "service_role";

grant delete on table "public"."leads_locations" to "anon";

grant insert on table "public"."leads_locations" to "anon";

grant references on table "public"."leads_locations" to "anon";

grant select on table "public"."leads_locations" to "anon";

grant trigger on table "public"."leads_locations" to "anon";

grant truncate on table "public"."leads_locations" to "anon";

grant update on table "public"."leads_locations" to "anon";

grant delete on table "public"."leads_locations" to "authenticated";

grant insert on table "public"."leads_locations" to "authenticated";

grant references on table "public"."leads_locations" to "authenticated";

grant select on table "public"."leads_locations" to "authenticated";

grant trigger on table "public"."leads_locations" to "authenticated";

grant truncate on table "public"."leads_locations" to "authenticated";

grant update on table "public"."leads_locations" to "authenticated";

grant delete on table "public"."leads_locations" to "service_role";

grant insert on table "public"."leads_locations" to "service_role";

grant references on table "public"."leads_locations" to "service_role";

grant select on table "public"."leads_locations" to "service_role";

grant trigger on table "public"."leads_locations" to "service_role";

grant truncate on table "public"."leads_locations" to "service_role";

grant update on table "public"."leads_locations" to "service_role";

grant delete on table "public"."leads_persons" to "anon";

grant insert on table "public"."leads_persons" to "anon";

grant references on table "public"."leads_persons" to "anon";

grant select on table "public"."leads_persons" to "anon";

grant trigger on table "public"."leads_persons" to "anon";

grant truncate on table "public"."leads_persons" to "anon";

grant update on table "public"."leads_persons" to "anon";

grant delete on table "public"."leads_persons" to "authenticated";

grant insert on table "public"."leads_persons" to "authenticated";

grant references on table "public"."leads_persons" to "authenticated";

grant select on table "public"."leads_persons" to "authenticated";

grant trigger on table "public"."leads_persons" to "authenticated";

grant truncate on table "public"."leads_persons" to "authenticated";

grant update on table "public"."leads_persons" to "authenticated";

grant delete on table "public"."leads_persons" to "service_role";

grant insert on table "public"."leads_persons" to "service_role";

grant references on table "public"."leads_persons" to "service_role";

grant select on table "public"."leads_persons" to "service_role";

grant trigger on table "public"."leads_persons" to "service_role";

grant truncate on table "public"."leads_persons" to "service_role";

grant update on table "public"."leads_persons" to "service_role";

grant delete on table "public"."locations" to "anon";

grant insert on table "public"."locations" to "anon";

grant references on table "public"."locations" to "anon";

grant select on table "public"."locations" to "anon";

grant trigger on table "public"."locations" to "anon";

grant truncate on table "public"."locations" to "anon";

grant update on table "public"."locations" to "anon";

grant delete on table "public"."locations" to "authenticated";

grant insert on table "public"."locations" to "authenticated";

grant references on table "public"."locations" to "authenticated";

grant select on table "public"."locations" to "authenticated";

grant trigger on table "public"."locations" to "authenticated";

grant truncate on table "public"."locations" to "authenticated";

grant update on table "public"."locations" to "authenticated";

grant delete on table "public"."locations" to "service_role";

grant insert on table "public"."locations" to "service_role";

grant references on table "public"."locations" to "service_role";

grant select on table "public"."locations" to "service_role";

grant trigger on table "public"."locations" to "service_role";

grant truncate on table "public"."locations" to "service_role";

grant update on table "public"."locations" to "service_role";

grant delete on table "public"."notes" to "anon";

grant insert on table "public"."notes" to "anon";

grant references on table "public"."notes" to "anon";

grant select on table "public"."notes" to "anon";

grant trigger on table "public"."notes" to "anon";

grant truncate on table "public"."notes" to "anon";

grant update on table "public"."notes" to "anon";

grant delete on table "public"."notes" to "authenticated";

grant insert on table "public"."notes" to "authenticated";

grant references on table "public"."notes" to "authenticated";

grant select on table "public"."notes" to "authenticated";

grant trigger on table "public"."notes" to "authenticated";

grant truncate on table "public"."notes" to "authenticated";

grant update on table "public"."notes" to "authenticated";

grant delete on table "public"."notes" to "service_role";

grant insert on table "public"."notes" to "service_role";

grant references on table "public"."notes" to "service_role";

grant select on table "public"."notes" to "service_role";

grant trigger on table "public"."notes" to "service_role";

grant truncate on table "public"."notes" to "service_role";

grant update on table "public"."notes" to "service_role";

grant delete on table "public"."persons" to "anon";

grant insert on table "public"."persons" to "anon";

grant references on table "public"."persons" to "anon";

grant select on table "public"."persons" to "anon";

grant trigger on table "public"."persons" to "anon";

grant truncate on table "public"."persons" to "anon";

grant update on table "public"."persons" to "anon";

grant delete on table "public"."persons" to "authenticated";

grant insert on table "public"."persons" to "authenticated";

grant references on table "public"."persons" to "authenticated";

grant select on table "public"."persons" to "authenticated";

grant trigger on table "public"."persons" to "authenticated";

grant truncate on table "public"."persons" to "authenticated";

grant update on table "public"."persons" to "authenticated";

grant delete on table "public"."persons" to "service_role";

grant insert on table "public"."persons" to "service_role";

grant references on table "public"."persons" to "service_role";

grant select on table "public"."persons" to "service_role";

grant trigger on table "public"."persons" to "service_role";

grant truncate on table "public"."persons" to "service_role";

grant update on table "public"."persons" to "service_role";

grant delete on table "public"."plan_coverage_type" to "anon";

grant insert on table "public"."plan_coverage_type" to "anon";

grant references on table "public"."plan_coverage_type" to "anon";

grant select on table "public"."plan_coverage_type" to "anon";

grant trigger on table "public"."plan_coverage_type" to "anon";

grant truncate on table "public"."plan_coverage_type" to "anon";

grant update on table "public"."plan_coverage_type" to "anon";

grant delete on table "public"."plan_coverage_type" to "authenticated";

grant insert on table "public"."plan_coverage_type" to "authenticated";

grant references on table "public"."plan_coverage_type" to "authenticated";

grant select on table "public"."plan_coverage_type" to "authenticated";

grant trigger on table "public"."plan_coverage_type" to "authenticated";

grant truncate on table "public"."plan_coverage_type" to "authenticated";

grant update on table "public"."plan_coverage_type" to "authenticated";

grant delete on table "public"."plan_coverage_type" to "service_role";

grant insert on table "public"."plan_coverage_type" to "service_role";

grant references on table "public"."plan_coverage_type" to "service_role";

grant select on table "public"."plan_coverage_type" to "service_role";

grant trigger on table "public"."plan_coverage_type" to "service_role";

grant truncate on table "public"."plan_coverage_type" to "service_role";

grant update on table "public"."plan_coverage_type" to "service_role";

grant delete on table "public"."plan_payment_day" to "anon";

grant insert on table "public"."plan_payment_day" to "anon";

grant references on table "public"."plan_payment_day" to "anon";

grant select on table "public"."plan_payment_day" to "anon";

grant trigger on table "public"."plan_payment_day" to "anon";

grant truncate on table "public"."plan_payment_day" to "anon";

grant update on table "public"."plan_payment_day" to "anon";

grant delete on table "public"."plan_payment_day" to "authenticated";

grant insert on table "public"."plan_payment_day" to "authenticated";

grant references on table "public"."plan_payment_day" to "authenticated";

grant select on table "public"."plan_payment_day" to "authenticated";

grant trigger on table "public"."plan_payment_day" to "authenticated";

grant truncate on table "public"."plan_payment_day" to "authenticated";

grant update on table "public"."plan_payment_day" to "authenticated";

grant delete on table "public"."plan_payment_day" to "service_role";

grant insert on table "public"."plan_payment_day" to "service_role";

grant references on table "public"."plan_payment_day" to "service_role";

grant select on table "public"."plan_payment_day" to "service_role";

grant trigger on table "public"."plan_payment_day" to "service_role";

grant truncate on table "public"."plan_payment_day" to "service_role";

grant update on table "public"."plan_payment_day" to "service_role";

grant delete on table "public"."plan_payment_method" to "anon";

grant insert on table "public"."plan_payment_method" to "anon";

grant references on table "public"."plan_payment_method" to "anon";

grant select on table "public"."plan_payment_method" to "anon";

grant trigger on table "public"."plan_payment_method" to "anon";

grant truncate on table "public"."plan_payment_method" to "anon";

grant update on table "public"."plan_payment_method" to "anon";

grant delete on table "public"."plan_payment_method" to "authenticated";

grant insert on table "public"."plan_payment_method" to "authenticated";

grant references on table "public"."plan_payment_method" to "authenticated";

grant select on table "public"."plan_payment_method" to "authenticated";

grant trigger on table "public"."plan_payment_method" to "authenticated";

grant truncate on table "public"."plan_payment_method" to "authenticated";

grant update on table "public"."plan_payment_method" to "authenticated";

grant delete on table "public"."plan_payment_method" to "service_role";

grant insert on table "public"."plan_payment_method" to "service_role";

grant references on table "public"."plan_payment_method" to "service_role";

grant select on table "public"."plan_payment_method" to "service_role";

grant trigger on table "public"."plan_payment_method" to "service_role";

grant truncate on table "public"."plan_payment_method" to "service_role";

grant update on table "public"."plan_payment_method" to "service_role";

grant delete on table "public"."plan_payment_mode" to "anon";

grant insert on table "public"."plan_payment_mode" to "anon";

grant references on table "public"."plan_payment_mode" to "anon";

grant select on table "public"."plan_payment_mode" to "anon";

grant trigger on table "public"."plan_payment_mode" to "anon";

grant truncate on table "public"."plan_payment_mode" to "anon";

grant update on table "public"."plan_payment_mode" to "anon";

grant delete on table "public"."plan_payment_mode" to "authenticated";

grant insert on table "public"."plan_payment_mode" to "authenticated";

grant references on table "public"."plan_payment_mode" to "authenticated";

grant select on table "public"."plan_payment_mode" to "authenticated";

grant trigger on table "public"."plan_payment_mode" to "authenticated";

grant truncate on table "public"."plan_payment_mode" to "authenticated";

grant update on table "public"."plan_payment_mode" to "authenticated";

grant delete on table "public"."plan_payment_mode" to "service_role";

grant insert on table "public"."plan_payment_mode" to "service_role";

grant references on table "public"."plan_payment_mode" to "service_role";

grant select on table "public"."plan_payment_mode" to "service_role";

grant trigger on table "public"."plan_payment_mode" to "service_role";

grant truncate on table "public"."plan_payment_mode" to "service_role";

grant update on table "public"."plan_payment_mode" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

grant delete on table "public"."task_statuses" to "anon";

grant insert on table "public"."task_statuses" to "anon";

grant references on table "public"."task_statuses" to "anon";

grant select on table "public"."task_statuses" to "anon";

grant trigger on table "public"."task_statuses" to "anon";

grant truncate on table "public"."task_statuses" to "anon";

grant update on table "public"."task_statuses" to "anon";

grant delete on table "public"."task_statuses" to "authenticated";

grant insert on table "public"."task_statuses" to "authenticated";

grant references on table "public"."task_statuses" to "authenticated";

grant select on table "public"."task_statuses" to "authenticated";

grant trigger on table "public"."task_statuses" to "authenticated";

grant truncate on table "public"."task_statuses" to "authenticated";

grant update on table "public"."task_statuses" to "authenticated";

grant delete on table "public"."task_statuses" to "service_role";

grant insert on table "public"."task_statuses" to "service_role";

grant references on table "public"."task_statuses" to "service_role";

grant select on table "public"."task_statuses" to "service_role";

grant trigger on table "public"."task_statuses" to "service_role";

grant truncate on table "public"."task_statuses" to "service_role";

grant update on table "public"."task_statuses" to "service_role";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";

grant delete on table "public"."team" to "anon";

grant insert on table "public"."team" to "anon";

grant references on table "public"."team" to "anon";

grant select on table "public"."team" to "anon";

grant trigger on table "public"."team" to "anon";

grant truncate on table "public"."team" to "anon";

grant update on table "public"."team" to "anon";

grant delete on table "public"."team" to "authenticated";

grant insert on table "public"."team" to "authenticated";

grant references on table "public"."team" to "authenticated";

grant select on table "public"."team" to "authenticated";

grant trigger on table "public"."team" to "authenticated";

grant truncate on table "public"."team" to "authenticated";

grant update on table "public"."team" to "authenticated";

grant delete on table "public"."team" to "service_role";

grant insert on table "public"."team" to "service_role";

grant references on table "public"."team" to "service_role";

grant select on table "public"."team" to "service_role";

grant trigger on table "public"."team" to "service_role";

grant truncate on table "public"."team" to "service_role";

grant update on table "public"."team" to "service_role";

grant delete on table "public"."twilio_subaccounts" to "anon";

grant insert on table "public"."twilio_subaccounts" to "anon";

grant references on table "public"."twilio_subaccounts" to "anon";

grant select on table "public"."twilio_subaccounts" to "anon";

grant trigger on table "public"."twilio_subaccounts" to "anon";

grant truncate on table "public"."twilio_subaccounts" to "anon";

grant update on table "public"."twilio_subaccounts" to "anon";

grant delete on table "public"."twilio_subaccounts" to "authenticated";

grant insert on table "public"."twilio_subaccounts" to "authenticated";

grant references on table "public"."twilio_subaccounts" to "authenticated";

grant select on table "public"."twilio_subaccounts" to "authenticated";

grant trigger on table "public"."twilio_subaccounts" to "authenticated";

grant truncate on table "public"."twilio_subaccounts" to "authenticated";

grant update on table "public"."twilio_subaccounts" to "authenticated";

grant delete on table "public"."twilio_subaccounts" to "service_role";

grant insert on table "public"."twilio_subaccounts" to "service_role";

grant references on table "public"."twilio_subaccounts" to "service_role";

grant select on table "public"."twilio_subaccounts" to "service_role";

grant trigger on table "public"."twilio_subaccounts" to "service_role";

grant truncate on table "public"."twilio_subaccounts" to "service_role";

grant update on table "public"."twilio_subaccounts" to "service_role";

grant delete on table "public"."upload_runs" to "anon";

grant insert on table "public"."upload_runs" to "anon";

grant references on table "public"."upload_runs" to "anon";

grant select on table "public"."upload_runs" to "anon";

grant trigger on table "public"."upload_runs" to "anon";

grant truncate on table "public"."upload_runs" to "anon";

grant update on table "public"."upload_runs" to "anon";

grant delete on table "public"."upload_runs" to "authenticated";

grant insert on table "public"."upload_runs" to "authenticated";

grant references on table "public"."upload_runs" to "authenticated";

grant select on table "public"."upload_runs" to "authenticated";

grant trigger on table "public"."upload_runs" to "authenticated";

grant truncate on table "public"."upload_runs" to "authenticated";

grant update on table "public"."upload_runs" to "authenticated";

grant delete on table "public"."upload_runs" to "service_role";

grant insert on table "public"."upload_runs" to "service_role";

grant references on table "public"."upload_runs" to "service_role";

grant select on table "public"."upload_runs" to "service_role";

grant trigger on table "public"."upload_runs" to "service_role";

grant truncate on table "public"."upload_runs" to "service_role";

grant update on table "public"."upload_runs" to "service_role";

create policy "user_access_on_agent_commission_rates"
on "public"."agent_commission_rates"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "user_access_on_annual_goals"
on "public"."annual_goals"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "user_access_on_application_history"
on "public"."application_history"
as permissive
for all
to public
using ((auth.uid() = changed_by));


create policy "Allow user to update their own rows."
on "public"."applications"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "insert_applications"
on "public"."applications"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "select_applications"
on "public"."applications"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "user_access_on_applications"
on "public"."applications"
as permissive
for all
to public
using (true);


create policy "delete_appointments"
on "public"."appointments"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "insert_appointments"
on "public"."appointments"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "select_appointments"
on "public"."appointments"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "update_appointments"
on "public"."appointments"
as permissive
for update
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Allow insert callback phone numbers only auth user id"
on "public"."callback_phone_numbers"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allow user to delete their own rows."
on "public"."callback_phone_numbers"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow user to update their own rows."
on "public"."callback_phone_numbers"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "Allow users to access their own callback phone numbers."
on "public"."callback_phone_numbers"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "insert_user_access"
on "public"."carrier_plans"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "select_user_access"
on "public"."carrier_plans"
as permissive
for select
to public
using (((user_id IS NULL) OR (user_id = auth.uid())));


create policy "update_user_access"
on "public"."carrier_plans"
as permissive
for update
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "insert_user_access"
on "public"."carriers"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "select_user_access"
on "public"."carriers"
as permissive
for select
to public
using (((user_id IS NULL) OR (user_id = auth.uid())));


create policy "select_own_filters"
on "public"."filters"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "user_access_on_lead_analytics"
on "public"."lead_analytics"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "insert_own_lead_sources"
on "public"."lead_sources"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "prevent_delete_on_default_lead_sources"
on "public"."lead_sources"
as permissive
for delete
to public
using ((NOT is_default));


create policy "select_own_lead_sources"
on "public"."lead_sources"
as permissive
for select
to public
using (((user_id IS NULL) OR (user_id = auth.uid())));


create policy "update_own_lead_sources"
on "public"."lead_sources"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "user_access_on_lead_statuses"
on "public"."lead_statuses"
as permissive
for all
to public
using (((auth.uid() = created_by) OR (created_by IS NULL)));


create policy "delete_own_leads"
on "public"."leads"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "insert_own_leads"
on "public"."leads"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "select_user_leads"
on "public"."leads"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "update_own_leads"
on "public"."leads"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "user_access_on_leads"
on "public"."leads"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "delete_leads_locations"
on "public"."leads_locations"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "insert_leads_locations"
on "public"."leads_locations"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "select_leads_locations"
on "public"."leads_locations"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "update_leads_locations"
on "public"."leads_locations"
as permissive
for update
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "insert_leads_persons"
on "public"."leads_persons"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM leads
  WHERE ((leads.id = leads_persons.lead_id) AND (leads.user_id = auth.uid())))));


create policy "user_access_on_leads_persons"
on "public"."leads_persons"
as permissive
for all
to public
using ((user_id = auth.uid()));


create policy "delete_location"
on "public"."locations"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "insert_location"
on "public"."locations"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "select_location"
on "public"."locations"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "select_user_locations"
on "public"."locations"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "update_location"
on "public"."locations"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "user_access_on_notes"
on "public"."notes"
as permissive
for all
to public
using ((auth.uid() = created_by));


create policy "insert_persons"
on "public"."persons"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "select_persons"
on "public"."persons"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "select_user_persons"
on "public"."persons"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "update_persons"
on "public"."persons"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "delete_profile"
on "public"."profile"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "insert_profile"
on "public"."profile"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "select_profile"
on "public"."profile"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "update_profile"
on "public"."profile"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "user_access_on_task_statuses"
on "public"."task_statuses"
as permissive
for all
to public
using ((auth.uid() = created_by));


create policy "user_access_on_tasks"
on "public"."tasks"
as permissive
for all
to public
using ((auth.uid() = assigned_to));


create policy "Enable insert for authenticated users only"
on "public"."team"
as permissive
for insert
to authenticated
with check (true);


create policy "delete_team_admin"
on "public"."team"
as permissive
for select
to public
using ((auth.role() = 'admin'::text));


create policy "read_team"
on "public"."team"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "read_team_admin"
on "public"."team"
as permissive
for select
to public
using ((auth.role() = 'admin'::text));


create policy "update_team_admin"
on "public"."team"
as permissive
for select
to public
using ((auth.role() = 'admin'::text));


create policy "insert_user_twilio_subaccounts"
on "public"."twilio_subaccounts"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "select_user_twilio_subaccounts"
on "public"."twilio_subaccounts"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "update_user_twilio_subaccounts"
on "public"."twilio_subaccounts"
as permissive
for update
to public
using ((auth.uid() = user_id));


CREATE TRIGGER refresh_search_leads_after_leads_change AFTER INSERT OR DELETE OR UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION refresh_search_leads();

CREATE TRIGGER trigger_log_lead_status_change AFTER UPDATE ON public.leads FOR EACH ROW WHEN ((old.lead_status_id IS DISTINCT FROM new.lead_status_id)) EXECUTE FUNCTION log_lead_status_change();

CREATE TRIGGER refresh_search_leads_after_locations_change AFTER INSERT OR DELETE OR UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION refresh_search_leads();

CREATE TRIGGER refresh_search_leads_after_persons_change AFTER INSERT OR DELETE OR UPDATE ON public.persons FOR EACH ROW EXECUTE FUNCTION refresh_search_leads();

CREATE TRIGGER "new-upload-run" AFTER INSERT ON public.upload_runs FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();

