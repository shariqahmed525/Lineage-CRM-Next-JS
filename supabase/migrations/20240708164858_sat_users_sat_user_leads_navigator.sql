create sequence "public"."sat_user_leads_navigator_id_seq";

create sequence "public"."sat_users_id_seq";

create table "public"."sat_user_leads_navigator" (
    "id" integer not null default nextval('sat_user_leads_navigator_id_seq'::regclass),
    "user_id" integer,
    "record_day" character varying(50),
    "lead_status" character varying(255),
    "lead_type" character varying(50),
    "first_name" character varying(50),
    "last_name" character varying(50),
    "phone1" character varying(50),
    "phone2" character varying(50),
    "street_address" character varying(255),
    "street_address2" character varying(255),
    "city" character varying(255),
    "state" character varying(255),
    "zip" character varying(255),
    "country" character varying(100),
    "age" character varying(10),
    "spouse_name" character varying(100),
    "spouse_age" character varying(10),
    "email_address" character varying(255),
    "quick_note" character varying(255),
    "called_phone1" integer,
    "called_phone2" integer,
    "date_created" timestamp without time zone,
    "lat" character varying(255),
    "lng" character varying(255),
    "file_attachment" text,
    "url" text
);


alter table "public"."sat_user_leads_navigator" enable row level security;

create table "public"."sat_users" (
    "id" integer not null default nextval('sat_users_id_seq'::regclass),
    "email" character varying(50),
    "name" character varying(50)
);


alter table "public"."sat_users" enable row level security;

alter sequence "public"."sat_user_leads_navigator_id_seq" owned by "public"."sat_user_leads_navigator"."id";

alter sequence "public"."sat_users_id_seq" owned by "public"."sat_users"."id";

CREATE UNIQUE INDEX sat_user_leads_navigator_pkey ON public.sat_user_leads_navigator USING btree (id);

CREATE UNIQUE INDEX sat_users_pkey ON public.sat_users USING btree (id);

alter table "public"."sat_user_leads_navigator" add constraint "sat_user_leads_navigator_pkey" PRIMARY KEY using index "sat_user_leads_navigator_pkey";

alter table "public"."sat_users" add constraint "sat_users_pkey" PRIMARY KEY using index "sat_users_pkey";

grant delete on table "public"."sat_user_leads_navigator" to "anon";

grant insert on table "public"."sat_user_leads_navigator" to "anon";

grant references on table "public"."sat_user_leads_navigator" to "anon";

grant select on table "public"."sat_user_leads_navigator" to "anon";

grant trigger on table "public"."sat_user_leads_navigator" to "anon";

grant truncate on table "public"."sat_user_leads_navigator" to "anon";

grant update on table "public"."sat_user_leads_navigator" to "anon";

grant delete on table "public"."sat_user_leads_navigator" to "authenticated";

grant insert on table "public"."sat_user_leads_navigator" to "authenticated";

grant references on table "public"."sat_user_leads_navigator" to "authenticated";

grant select on table "public"."sat_user_leads_navigator" to "authenticated";

grant trigger on table "public"."sat_user_leads_navigator" to "authenticated";

grant truncate on table "public"."sat_user_leads_navigator" to "authenticated";

grant update on table "public"."sat_user_leads_navigator" to "authenticated";

grant delete on table "public"."sat_user_leads_navigator" to "service_role";

grant insert on table "public"."sat_user_leads_navigator" to "service_role";

grant references on table "public"."sat_user_leads_navigator" to "service_role";

grant select on table "public"."sat_user_leads_navigator" to "service_role";

grant trigger on table "public"."sat_user_leads_navigator" to "service_role";

grant truncate on table "public"."sat_user_leads_navigator" to "service_role";

grant update on table "public"."sat_user_leads_navigator" to "service_role";

grant delete on table "public"."sat_users" to "anon";

grant insert on table "public"."sat_users" to "anon";

grant references on table "public"."sat_users" to "anon";

grant select on table "public"."sat_users" to "anon";

grant trigger on table "public"."sat_users" to "anon";

grant truncate on table "public"."sat_users" to "anon";

grant update on table "public"."sat_users" to "anon";

grant delete on table "public"."sat_users" to "authenticated";

grant insert on table "public"."sat_users" to "authenticated";

grant references on table "public"."sat_users" to "authenticated";

grant select on table "public"."sat_users" to "authenticated";

grant trigger on table "public"."sat_users" to "authenticated";

grant truncate on table "public"."sat_users" to "authenticated";

grant update on table "public"."sat_users" to "authenticated";

grant delete on table "public"."sat_users" to "service_role";

grant insert on table "public"."sat_users" to "service_role";

grant references on table "public"."sat_users" to "service_role";

grant select on table "public"."sat_users" to "service_role";

grant trigger on table "public"."sat_users" to "service_role";

grant truncate on table "public"."sat_users" to "service_role";

grant update on table "public"."sat_users" to "service_role";

create policy "Enable read access for all users"
on "public"."sat_user_leads_navigator"
as permissive
for select
to authenticated
using (true);

create policy "allow update access to all users"
on "public"."sat_user_leads_navigator"
as permissive
for update
to authenticated
using (true);

create policy "Enable read access for all users"
on "public"."sat_users"
as permissive
for select
to authenticated
using (true);



