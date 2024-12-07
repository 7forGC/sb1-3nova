-- Create enum for message types and status
create type message_type as enum ('text', 'image', 'audio', 'video');
create type message_status as enum ('sent', 'delivered', 'read');

-- Create messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references chats(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete set null not null,
  content text,
  type message_type default 'text'::message_type not null,
  status message_status default 'sent'::message_status not null,
  media_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table messages enable row level security;

-- Create policies
create policy "Chat participants can view messages"
  on messages for select
  using (
    exists (
      select 1 from chat_participants
      where chat_id = messages.chat_id
      and profile_id = auth.uid()
    )
  );

create policy "Chat participants can insert messages"
  on messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from chat_participants
      where chat_id = messages.chat_id
      and profile_id = auth.uid()
    )
  );

create policy "Message senders can update their messages"
  on messages for update
  using ( auth.uid() = sender_id );

-- Create indexes
create index messages_chat_id_created_at_idx on messages (chat_id, created_at);
create index messages_sender_id_idx on messages (sender_id);

-- Set up trigger for messages updated_at
create trigger update_messages_updated_at
  before update on messages
  for each row
  execute function update_updated_at_column();