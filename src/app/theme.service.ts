import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

const STORAGE_KEY = 'theme';

/** Light/dark mode: follows the OS until the user picks one, then remembers it. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  dark = false;

  init() {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch { /* storage blocked: fall back to the OS setting */ }
    this.apply(stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  setDark(dark: boolean) {
    this.apply(dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch { /* not persisted; still applied for this session */ }
  }

  private apply(dark: boolean) {
    this.dark = dark;
    document.documentElement.classList.toggle('ion-palette-dark', dark);
    if (Capacitor.isNativePlatform()) {
      // Style.Dark = light status-bar icons, for dark backgrounds
      StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
    }
  }
}
