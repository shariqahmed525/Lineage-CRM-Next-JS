alter table "public"."persons" add column "dob" date;

alter table "public"."applications" drop column "age_on_effective_date";

alter table "public"."applications" add column "age_on_effective_date" integer;

update public.applications app
set
  age_on_effective_date = extract(
    year
    from
      app.effective_first_draft_date
  ) - extract(
    year
    from
      p.dob
  )
from
  public.persons p
where
  app.person_id = p.person_id;