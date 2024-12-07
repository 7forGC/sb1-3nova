import { Observable } from '@nativescript/core';
import { Message } from '../../types/supabase';
import { supabase, getCurrentUser, subscribeToMessages } from '../../services/supabase';
import { ChatBubble } from '../../components/chat/ChatBubble';

export class ChatDetailViewModel extends Observable {
  private _messages: ChatBubble[] = [];
  private _messageText: string = '';
  private _chatId: string;
  private _subscription: any;

  constructor(chatId: string) {
    super();
    this._chatId = chatId;
    this.loadMessages();
    this.setupRealTimeSubscription();
  }

  get messages() {
    return this._messages;
  }

  get messageText() {
    return this._messageText;
  }

  set messageText(value: string) {
    if (this._messageText !== value) {
      this._messageText = value;
      this.notifyPropertyChange('messageText', value);
    }
  }

  async loadMessages() {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', this._chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const user = await getCurrentUser();
      this._messages = messages.map(msg => new ChatBubble(msg, user.id));
      this.notifyPropertyChange('messages', this._messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  setupRealTimeSubscription() {
    this._subscription = subscribeToMessages(this._chatId, (payload) => {
      const newMessage = payload.new as Message;
      const user = getCurrentUser();
      this._messages.push(new ChatBubble(newMessage, user.id));
      this.notifyPropertyChange('messages', this._messages);
    });
  }

  async sendMessage() {
    if (!this._messageText.trim()) return;

    try {
      const user = await getCurrentUser();
      await supabase.from('messages').insert([{
        chat_id: this._chatId,
        sender_id: user.id,
        content: this._messageText,
        type: 'text'
      }]);

      this.messageText = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  onUnloaded() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}