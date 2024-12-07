import { Observable } from '@nativescript/core';
import { supabase } from '../supabase';
import { Message, Chat } from './message.model';
import { translationService } from '../translation/translation.service';

export class ChatService extends Observable {
  private static instance: ChatService;
  private _activeChat: Chat | null = null;
  private _messages: Message[] = [];

  private constructor() {
    super();
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  get activeChat() {
    return this._activeChat;
  }

  get messages() {
    return this._messages;
  }

  async loadMessages(chatId: string, userLanguage: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Translate messages if needed
      const translatedMessages = await Promise.all(
        data.map(async (message) => {
          if (message.translated_content?.[userLanguage]) {
            return message;
          }
          const translatedContent = await translationService.translateText(
            message.content,
            userLanguage
          );
          return {
            ...message,
            translated_content: {
              ...message.translated_content,
              [userLanguage]: translatedContent
            }
          };
        })
      );

      this._messages = translatedMessages;
      this.notifyPropertyChange('messages', this._messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      throw error;
    }
  }

  async sendMessage(content: string, type: Message['type'] = 'text') {
    if (!this._activeChat) return;

    try {
      const { data, error } = await supabase.from('messages').insert([
        {
          chat_id: this._activeChat.id,
          content,
          type,
          status: 'sent'
        }
      ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

export const chatService = ChatService.getInstance();