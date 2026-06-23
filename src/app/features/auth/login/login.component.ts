import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStorageService } from '../../../core/services/user-storage.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userStorage = inject(UserStorageService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  protected errorMessage = '';
  protected successMessage = '';

  protected submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter valid email and password.';
      return;
    }

    const formValue = this.loginForm.getRawValue();
    const email = formValue.email ?? '';
    const password = formValue.password ?? '';

    const users = this.userStorage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      window.localStorage.setItem('currentUser', JSON.stringify(user));
      window.localStorage.setItem('isLoggedIn', 'true');
      this.successMessage = 'Login successful! Redirecting...';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 500);
    } else {
      this.errorMessage = 'Invalid email or password.';
    }
  }

  protected hasError(controlName: string, errorName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }
}
