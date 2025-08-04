alter table "public"."appointments" alter column "end_date" drop not null;

alter table "public"."appointments" alter column "end_date" set data type text using "end_date"::text;

alter table "public"."appointments" alter column "start_date" drop not null;

alter table "public"."appointments" alter column "start_date" set data type text using "start_date"::text;

alter table "public"."appointments" alter column "title" drop not null;

