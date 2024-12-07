export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  created_at: string;
  type: 'text' | 'image' | 'audio' | 'video';
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  created_at: string;
  type: 'individual' | 'group';
  name?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  last_seen?: string;
  language_preference?: string;
}