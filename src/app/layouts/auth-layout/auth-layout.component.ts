import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <main class="app-shell">
      <header class="app-shell__header">
        <p class="app-shell__eyebrow">User Management System</p>
        <h1>Hello {{ title() }}</h1>
        <p class="app-shell__subtitle">Please enter the details properly.</p>
      </header>
      <section class="app-shell__content">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
  protected readonly title = signal('there!');
}
