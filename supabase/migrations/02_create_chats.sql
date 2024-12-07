-- Create enum for chat types
create type chat_type as enum ('individual', 'group');

-- Create chats table
create table chats (
  id uuid default uuid_generate_v4() primary key,
  type chat_type not null,
  name text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create chat participants junction table
create table chat_participants (
  chat_id uuid references chats(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  last_read_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (chat_id, profile_id)
);

-- Enable RLS
alter table chats enable row level security;
alter table chat_participants enable row level security;

-- Create policies
create policy "Chat participants can view chats"
  on chats for select
  using (
    exists (
      select 1 from chat_participants
      where chat_id = chats.id
      and profile_id = auth.uid()
    )
  );

create policy "Users can create chats"
  on chats for insert
  with check ( auth.uid() = created_by );

create policy "Chat participants can view participants"
  on chat_participants for select
  using (
    exists (
      select 1 from chat_participants cp
      where cp.chat_id = chat_participants.chat_id
      and cp.profile_id = auth.uid()
    )
  );

-- Create indexes
create index chat_participants_profile_id_idx on chat_participants (profile_id);
create index chat_participants_chat_id_idx on chat_participants (chat_id);

-- Set up trigger for chats updated_at
create trigger update_chats_updated_at
  before update on chats
  for each row
  execute function update_updated_at_column();