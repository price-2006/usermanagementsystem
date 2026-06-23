import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { RegisteredUser } from '../../core/services/user-storage.service';

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordsMismatch: true };
};

@Component({
  selector: 'app-add-user-modal',
  standalone: false,
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss'
})
export class AddUserModalComponent implements OnInit {
  /** Controls visibility from the parent */
  @Output() save = new EventEmitter<RegisteredUser>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  visible = false;

  addForm = this.fb.group(
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

  errorMessage = '';

  ngOnInit(): void {}

  open(): void {
    this.addForm.reset();
    this.errorMessage = '';
    this.visible = true;
  }

  close(): void {
    this.visible = false;
    this.addForm.reset();
    this.errorMessage = '';
    this.cancel.emit();
  }

  submit(): void {
    this.errorMessage = '';

    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      this.errorMessage = 'Please correct the highlighted fields and try again.';
      return;
    }

    const v = this.addForm.getRawValue();
    const user: RegisteredUser = {
      fullName: v.fullName ?? '',
      email: v.email ?? '',
      mobile: v.mobile ?? '',
      password: v.password ?? '',
      gender: v.gender ?? '',
      address: v.address ?? ''
    };

    this.save.emit(user);
    this.visible = false;
    this.addForm.reset();
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.addForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }

  get passwordMismatch(): boolean {
    return this.addForm.touched && this.addForm.hasError('passwordsMismatch');
  }
}
