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
| id          | uuid         | YES      | Primary key, default uuid()|
| title       | text         | NO       | Note title                 |
| content     | text         | NO       | Note body                  |
| created_at  | timestamptz  | YES      | Defaults to now()          |
| updated_at  | timestamptz  | YES      | Updated automatically      |

You can run the following SQL in Supabase SQL Editor to create the table:

```sql
create table notes (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- To auto-update updated_at timestamp:
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

## Integration Points

- The frontend code (see `src/supabaseClient.js`) uses the Supabase JavaScript SDK.
- All note CRUD operations are abstracted through `src/api/notes.js`.
- You should never commit API keys for production. Use environment variables.

## More Info

- [Supabase Docs](https://supabase.com/docs)

