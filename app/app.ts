import { Application } from '@nativescript/core';
import { supabase } from './services/supabase.service';
import { uiStateService } from './services';
import 'dotenv/config';

Application.on(Application.launchEvent, () => {
  // Set up gesture recognition for menu
  Application.on(Application.resumeEvent, () => {
    uiStateService.showMenu();
  });
});

// Initialize Supabase auth listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

Application.run({ moduleName: 'app-root' });