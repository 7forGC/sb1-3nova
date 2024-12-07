import { Observable } from '@nativescript/core';
import { supabase } from '../supabase';

export class AuthService extends Observable {
  private static instance: AuthService;
  private _currentUser: any = null;

  private constructor() {
    super();
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initializeAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    this._currentUser = user;
  }

  get currentUser() {
    return this._currentUser;
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      this._currentUser = data.user;
      this.notifyPropertyChange('currentUser', this._currentUser);
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      this._currentUser = null;
      this.notifyPropertyChange('currentUser', this._currentUser);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}

export const authService = AuthService.getInstance();