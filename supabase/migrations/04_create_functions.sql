-- Function to create a new chat between two users
create or replace function public.create_individual_chat(other_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_chat_id uuid;
  v_user_id uuid;
begin
  -- Get the current user's ID
  v_user_id := auth.uid();
  
  -- Check if user exists
  if not exists (select 1 from profiles where id = other_user_id) then
    raise exception 'User not found';
  end if;

  -- Check if chat already exists
  select c.id into v_chat_id
  from chats c
  join chat_participants cp1 on cp1.chat_id = c.id
  join chat_participants cp2 on cp2.chat_id = c.id
  where c.type = 'individual'
  and ((cp1.profile_id = v_user_id and cp2.profile_id = other_user_id)
       or (cp1.profile_id = other_user_id and cp2.profile_id = v_user_id));

  -- If chat doesn't exist, create it
  if v_chat_id is null then
    insert into chats (type, created_by)
    values ('individual', v_user_id)
    returning id into v_chat_id;

    -- Add participants
    insert into chat_participants (chat_id, profile_id)
    values
      (v_chat_id, v_user_id),
      (v_chat_id, other_user_id);
  end if;

  return v_chat_id;
end;
$$;