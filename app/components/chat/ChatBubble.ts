import { Observable } from '@nativescript/core';
import { Message } from '../../types/supabase';

export class ChatBubble extends Observable {
  private _message: Message;
  private _isCurrentUser: boolean;

  constructor(message: Message, currentUserId: string) {
    super();
    this._message = message;
    this._isCurrentUser = message.user_id === currentUserId;
  }

  get messageContent(): string {
    return this._message.content;
  }

  get bubbleClass(): string {
    return this._isCurrentUser ? 'message-bubble sent-message' : 'message-bubble received-message';
  }

  get timestamp(): string {
    return new Date(this._message.created_at).toLocaleTimeString();
  }
}