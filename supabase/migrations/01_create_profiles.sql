-- Create a table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  last_seen timestamp with time zone default timezone('utc'::text, now()),
  language_preference text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create indexes
create index profiles_username_idx on profiles (username);
create index profiles_last_seen_idx on profiles (last_seen);

-- Set up trigger for profiles updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function public.update_updated_at_column();