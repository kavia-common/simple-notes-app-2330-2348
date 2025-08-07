# Supabase Integration Notes

This React app uses Supabase for backend data storage and CRUD operations.

## Required Environment Variables

- `REACT_APP_SUPABASE_URL`  
- `REACT_APP_SUPABASE_KEY`  

These must be set in your environment (see `.env.example`) and will be exposed via `process.env` at runtime.

## Supabase Table Schema

You must have a `notes` table in your Supabase project with the following fields:

| Field       | Type         | Required | Notes                      |
|-------------|--------------|----------|----------------------------|
| id          | uuid         | YES      | Primary key, default uuid_generate_v4()|
| title       | text         | NO       | Note title (nullable)      |
| content     | text         | NO       | Note body (nullable)       |
| created_at  | timestamptz  | YES      | Defaults to now()          |
| updated_at  | timestamptz  | YES      | Updated automatically      |

(Any other columns, such as category, can exist, but only the above are used in the app.)

The SQL for the required schema and trigger (run in Supabase SQL Editor):

```sql
-- Table
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure correct columns (rename if body->content)
alter table notes rename column body to content;

-- Ensure title/content are nullable (remove NOT NULL if present)
alter table notes alter column title drop not null;
alter table notes alter column content drop not null;

-- Ensure updated_at defaults to now()
alter table notes alter column updated_at set default now();

-- Auto-update 'updated_at' on every update
create or replace function notes_update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on notes;

create trigger set_updated_at
  before update on notes
  for each row execute procedure notes_update_updated_at();
```

## Backend Verification Notes

- Table 'notes' with specified columns has been validated.
- Auto-update trigger on 'updated_at' is active.
- All column and trigger configurations match frontend code requirements.

## Integration Points

- The frontend code (see `src/supabaseClient.js`) uses the Supabase JavaScript SDK.
- All note CRUD operations are abstracted through `src/api/notes.js`.
- You should never commit API keys for production. Use environment variables.

## More Info

- [Supabase Docs](https://supabase.com/docs)

