import { Observable } from '@nativescript/core';

export class TranslationService extends Observable {
  private static instance: TranslationService;
  private cache: Map<string, string> = new Map();
  private userLanguage: string = 'en';

  private constructor() {
    super();
  }

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  setUserLanguage(language: string) {
    this.userLanguage = language;
    this.notifyPropertyChange('userLanguage', this.userLanguage);
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const cacheKey = `${text}_${targetLanguage}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Here we'll implement the actual translation logic
      // For now, returning the original text
      const translatedText = text;
      this.cache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const translationService = TranslationService.getInstance();