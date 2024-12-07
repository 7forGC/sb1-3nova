import { Observable } from '@nativescript/core';

export class UIStateService extends Observable {
  private static instance: UIStateService;
  private _isMenuVisible: boolean = true;
  private _menuHideTimeout: any = null;

  private constructor() {
    super();
  }

  static getInstance(): UIStateService {
    if (!UIStateService.instance) {
      UIStateService.instance = new UIStateService();
    }
    return UIStateService.instance;
  }

  get isMenuVisible(): boolean {
    return this._isMenuVisible;
  }

  showMenu(): void {
    this._isMenuVisible = true;
    this.notifyPropertyChange('isMenuVisible', this._isMenuVisible);
    
    if (this._menuHideTimeout) {
      clearTimeout(this._menuHideTimeout);
    }

    this._menuHideTimeout = setTimeout(() => {
      this.hideMenu();
    }, 3000); // Hide after 3 seconds
  }

  hideMenu(): void {
    this._isMenuVisible = false;
    this.notifyPropertyChange('isMenuVisible', this._isMenuVisible);
  }

  toggleMenu(): void {
    if (this._isMenuVisible) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }
}

export const uiStateService = UIStateService.getInstance();