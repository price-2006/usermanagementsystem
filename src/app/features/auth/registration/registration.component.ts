import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisteredUser, UserStorageService } from '../../../core/services/user-storage.service';

const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordsMismatch: true };
};

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userStorage = inject(UserStorageService);

  protected readonly registrationForm = this.formBuilder.group(
    {
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required]
    },
    { validators: passwordsMatchValidator }
  );

  protected successMessage = '';
  protected errorMessage = '';
  protected isLoading = false;

  protected submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.errorMessage = 'Please correct the highlighted fields and try again.';
      return;
    }

    const formValue = this.registrationForm.getRawValue();
    const user: RegisteredUser = {
      fullName: formValue.fullName ?? '',
      email: formValue.email ?? '',
      mobile: formValue.mobile ?? '',
      password: formValue.password ?? '',
      gender: formValue.gender ?? '',
      address: formValue.address ?? ''
    };

    this.isLoading = true;

    this.userStorage.saveUser(user).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'User registered successfully.';
        this.registrationForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Could not reach the server. Please try again.';
      }
    });
  }

  protected hasError(controlName: string, errorName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }

  protected get passwordMismatch(): boolean {
    return this.registrationForm.touched && this.registrationForm.hasError('passwordsMismatch');
  }
}
