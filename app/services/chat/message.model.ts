export interface Message {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  created_at: string;
  type: 'text' | 'image' | 'audio' | 'video';
  status: 'sent' | 'delivered' | 'read';
  translated_content?: { [key: string]: string };
}

export interface Chat {
  id: string;
  name?: string;
  type: 'individual' | 'group';
  last_message?: Message;
  participants: string[];
  created_at: string;
}