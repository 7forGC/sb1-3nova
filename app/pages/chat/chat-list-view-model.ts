import { Observable } from '@nativescript/core';
import { supabase, getCurrentUser } from '../../services/supabase';

export class ChatListViewModel extends Observable {
  private _chats = [];

  constructor() {
    super();
    this.loadChats();
  }

  get chats() {
    return this._chats;
  }

  async loadChats() {
    try {
      const user = await getCurrentUser();
      const { data: chats, error } = await supabase
        .from('chats')
        .select(`
          *,
          chat_participants (
            profile:profiles(username, avatar_url)
          ),
          messages (
            content,
            created_at
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      this._chats = chats.map(chat => ({
        id: chat.id,
        name: chat.name,
        participants: chat.chat_participants
          .map(cp => cp.profile.username)
          .join(', '),
        lastMessage: chat.messages[0]?.content || 'No messages yet',
        avatar_url: chat.chat_participants[0]?.profile.avatar_url
      }));

      this.notifyPropertyChange('chats', this._chats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  }

  onNewChat() {
    // Navigate to new chat page
  }

  onChatTap(args) {
    const chatId = this._chats[args.index].id;
    // Navigate to chat detail page
  }
}