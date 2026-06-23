import { Component, inject } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: false,
  template: `
    <button
      class="theme-toggle"
      (click)="theme.toggle()"
      [attr.aria-label]="theme.isLight() ? 'Switch to dark mode' : 'Switch to light mode'"
      [title]="theme.isLight() ? 'Switch to dark mode' : 'Switch to light mode'">
      <span class="theme-toggle__icon">{{ theme.isLight() ? '🌙' : '☀️' }}</span>
      <span class="theme-toggle__label">{{ theme.isLight() ? 'Dark' : 'Light' }}</span>
    </button>
  `,
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
}
