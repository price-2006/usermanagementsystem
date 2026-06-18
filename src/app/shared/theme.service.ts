import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';

  /** true = light, false = dark */
  isLight = signal<boolean>(this.loadPreference());

  constructor() {
    // Apply theme class to <body> whenever the signal changes
    effect(() => {
      this.applyTheme(this.isLight());
    });
  }

  toggle(): void {
    this.isLight.update(v => !v);
    localStorage.setItem(this.STORAGE_KEY, this.isLight() ? 'light' : 'dark');
  }

  private loadPreference(): boolean {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return saved === 'light';
    // Respect OS preference as default
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  private applyTheme(light: boolean): void {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('light', light);
  }
}
