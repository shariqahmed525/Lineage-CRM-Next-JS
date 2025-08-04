drop materialized view if exists "public"."search_leads";

alter table "public"."locations" add column "county" text;

alter table "public"."locations" enable row level security;

alter table "public"."persons" drop column "called_phone1";

alter table "public"."persons" drop column "called_phone2";

alter table "public"."sat_user_leads_navigator" add column "is_migrated" boolean default false;

