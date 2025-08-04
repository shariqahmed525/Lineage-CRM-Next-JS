create table "public"."leads_filters" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null,
    "filters" jsonb not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    primary key ("id"),
    foreign key ("user_id") references auth.users(id)
);

alter table "public"."leads_filters" drop constraint if exists "leads_filters_user_id_fkey";
alter table "public"."leads_filters" add constraint "leads_filters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

alter table "public"."leads_filters" enable row level security;

grant delete on table "public"."leads_filters" to "authenticated";

grant insert on table "public"."leads_filters" to "authenticated";

grant references on table "public"."leads_filters" to "authenticated";

grant select on table "public"."leads_filters" to "authenticated";

grant trigger on table "public"."leads_filters" to "authenticated";

grant truncate on table "public"."leads_filters" to "authenticated";

grant update on table "public"."leads_filters" to "authenticated";

grant delete on table "public"."leads_filters" to "service_role";

grant insert on table "public"."leads_filters" to "service_role";

grant references on table "public"."leads_filters" to "service_role";

grant select on table "public"."leads_filters" to "service_role";

grant trigger on table "public"."leads_filters" to "service_role";

grant truncate on table "public"."leads_filters" to "service_role";

grant update on table "public"."leads_filters" to "service_role";

create policy "leads_filters_policy" on "public"."leads_filters" as permissive for all to public using (auth.uid() = user_id);