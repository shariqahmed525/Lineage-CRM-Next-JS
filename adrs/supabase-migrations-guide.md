# Supabase Migrations Guide 🚀
Hey there, digital native! Ready to level up your database skills? You've landed in the right spot. This guide will walk you through the process of managing your database migrations using the Supabase CLI. It's like unlocking a new skill level! 🦸‍♀️🦸‍♂️

Before we dive in, make sure to check out the [Supabase CLI documentation](https://supabase.io/docs/guides/cli) for a comprehensive overview of all the cool things you can do with the CLI. Trust us, it's worth the read!

Alright, let's get started! 🎉


## Step 1: Install the Supabase CLI

Before you can use the Supabase CLI, you need to install it. You can do this using the following command:

```bash
yarn global add @supabase/cli
```

## Step 2: Login to Supabase

To connect your local project to the Supabase platform, you need to login using the `supabase login` command. This command will prompt you to enter your Supabase credentials. Run the following command and follow the prompts:

```bash
yarn run supabase-login
```

## Step 3: Link Your Database

To link your local project to your Supabase database, use the `supabase link` command. This command will prompt you to select a database to link to your project. Run the following command and follow the prompts:

```bash
yarn run db-link
```

## Step 4: Pull the Latest Database Schema

To ensure your local project is up-to-date with the latest database schema, use the `supabase db pull` command. This command will pull the latest database schema from your linked Supabase database. Run the following command:

```bash
yarn run db-pull
```

## Step 5: Generate TypeScript Types

To generate TypeScript types directly from your database schema, use the `supabase gen types` command. This command will generate TypeScript types and save them to the `types/types.ts` file. Run the following command:

```bash
yarn run gen-db-types
```

## Step 6: Create a New Migration

To create a new migration, use the `supabase migration new` command followed by the name of your migration. This command will create a new migration file in the `supabase/migrations` directory. Replace `YOUR_MIGRATION_NAME` with the name of your migration and run the following command:

```bash
supabase migration new YOUR_MIGRATION_NAME
```

## Step 7: Apply the Migration

To apply the migration to your linked Supabase database, use the `supabase migration up` command. This command will apply the migration to your linked Supabase database. Run the following command:

```bash
supabase migration up --linked
```

And that's it! You've successfully created a migration on a linked Supabase database using the Supabase CLI. For more information on the Supabase CLI, refer to the [official documentation](https://supabase.io/docs/guides/cli).

## **Databases** 
---------------------------------------------------
Production: 
postgres://postgres.ndrjvihvezscmgzylopb:<PRODUCTION_PASSWORD>@aws-0-us-west-1.pooler.supabase.com:6543/postgres 

Staging: 
postgres://postgres.wqmrevkznbklmyvdkrce:<STAGING_PASSWORD>@aws-0-us-west-1.pooler.supabase.com:6543/postgres 

#### Common Error
---------------------------------------------------
***failed to query rows: ERROR: prepared statement "lrupsc_1_0" already exists (SQLSTATE 42P05)

```sh
# Solution Marking migration file(s) as applied
# ***Run inside /supabase dir:
npx supabase migration repair <migration_file_timestamp> --status applied --db-url <db_url_link>
```
#### Comparing Local DB vs Remote DB
---------------------------------------------------
***Run inside /supabase dir:
```sh
supabase db diff -f <migration_file_name> --db-url <db_url_link>
```

Happy coding! 🚀