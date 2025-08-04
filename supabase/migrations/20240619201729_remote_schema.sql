drop policy "delete_appointments" on "public"."appointments";

drop policy "insert_appointments" on "public"."appointments";

drop policy "select_appointments" on "public"."appointments";

drop policy "update_appointments" on "public"."appointments";

drop policy "leads_filters_policy" on "public"."leads_filters";

alter table "public"."applications" alter column "age_on_effective_date" set data type bigint using "age_on_effective_date"::bigint;

alter table "public"."filters" add column "name" text;

alter table "public"."leads_filters" drop column "created_at";

alter table "public"."leads_filters" drop column "updated_at";

alter table "public"."leads_filters" disable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_search_leads()
 RETURNS SETOF search_leads
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY SELECT * FROM search_leads;
END;
$function$
;

create policy "allow all access type to appointments"
on "public"."appointments"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



