# Supabase CLI - Comprehensive Guide

## Introduction
This README document provides a comprehensive overview of using Supabase CLI in your project. It covers all the essential commands, their usage, and how to integrate them into your workflow. By the end of this guide, you'll be able to manage local, staging, and production environments effectively.

## Getting Started
### Installation
To install the Supabase CLI, follow the steps below:

```bash
# For macOS using Homebrew
brew install supabase/tap/supabase

# For npm users
npm install -g supabase
```
Refer to the [installation guide](https://supabase.com/docs/guides/cli/getting-started) for detailed instructions.

### Initialize Project
Create a new Supabase project in your local environment:

```bash
supabase init
```

This will create a `supabase` folder with the necessary configuration files.

### Start Local Development
Start the Supabase stack locally:

```bash
supabase start
```
This command runs the Supabase services locally using Docker containers.

## Managing Database Migrations
### Create Migrations
Create a new migration:

```bash
supabase db migrate new <migration_name>
```
This command generates a new migration file in the `supabase/migrations` directory.

### Apply Migrations
Apply migrations to your local database:

```bash
supabase db push
```
This applies all pending migrations to the local database.

### Pull Schema Changes
Pull schema changes from a remote database:

```bash
supabase db pull
```
This command pulls the latest schema changes from the remote database and creates a new migration file.

### Reset Local Database
Reset your local database to a clean state:

```bash
supabase db reset
```
This recreates the local Postgres container and applies all local migrations.

### Dump Database
Dump the contents of a remote database:

```bash
supabase db dump
```
This command creates a dump of the remote database, excluding Supabase-managed schemas.

## Deploying to Staging and Production
### Staging
Apply migrations to the staging environment:

```bash
supabase db push --db-url <STAGING_DB_URL>
```
This command applies migrations to the specified staging database.

### Production
Apply migrations to the production environment:

```bash
supabase db push --db-url <PRODUCTION_DB_URL>
```
Ensure all migrations are thoroughly tested in staging before applying to production.

## Continuous Integration and Deployment (CI/CD)
### GitHub Actions
To automate deployments using GitHub Actions, configure your CI/CD pipeline as follows:

1. **Setup GitHub Secrets:**
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_DB_PASSWORD`
   - `SUPABASE_PROJECT_ID`

2. **GitHub Actions Workflow:**

```yaml
name: Deploy to Supabase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - name: Apply Migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```
Refer to the [Supabase GitHub Actions](https://github.com/supabase/setup-cli) documentation for more details.

## Commands Overview
### General Commands
- **supabase start:** Starts the local Supabase stack.
- **supabase stop:** Stops the local Supabase stack.

### Database Commands
- **supabase db migrate new <migration_name>:** Creates a new migration.
- **supabase db push:** Applies local migrations to the database.
- **supabase db pull:** Pulls schema changes from a remote database.
- **supabase db reset:** Resets the local database to a clean state.
- **supabase db dump:** Dumps the contents of a remote database.

### Project Management Commands
- **supabase init:** Initializes a new Supabase project.
- **supabase link:** Links a local project to a remote Supabase project.

## Conclusion
This document provides a complete guide to using Supabase CLI for managing database migrations and deployments. By following these steps, you can ensure a smooth workflow for local, staging, and production environments. For more detailed information, refer to the [Supabase CLI documentation](https://supabase.com/docs/guides/cli/getting-started).

## Further Reading
1. [Easily Sync different Supabase Instances with Supabase Migrations / CLI - YouTube](https://www.youtube.com/watch?v=nyX_EygplXQ) - Jeff recommended this video, it walks through the Supabase CLI pretty damn well.
2. [Supabase CLI Documentation](https://supabase.com/docs/guides/cli/getting-started)
3. [Managing Environments with Supabase](https://supabase.com/docs/guides/cli/managing-environments)
4. [Supabase GitHub Actions](https://github.com/supabase/setup-cli)
5. [Database Migrations](https://supabase.com/docs/guides/database/migrations)
This comprehensive guide should help your team get started with Supabase and manage your database migrations efficiently. Let me know if you need more details on any specific part!