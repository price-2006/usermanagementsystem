import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RegisteredUser } from '../../core/services/user-storage.service';

@Component({
  selector: 'app-user-form-modal',
  standalone: false,
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.scss'
})
export class UserFormModalComponent implements OnChanges {
  /** The user being edited. When null, the modal is hidden. */
  @Input() user: RegisteredUser | null = null;

  @Output() save = new EventEmitter<RegisteredUser>();
  @Output() cancel = new EventEmitter<void>();

  /** Internal copy so we don't mutate the original */
  formData: Partial<RegisteredUser> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.formData = { ...this.user };
    }
  }

  onSave(): void {
    if (this.isValid()) {
      this.save.emit(this.formData as RegisteredUser);
    }
  }

  onCancel(): void {
    this.formData = {};
    this.cancel.emit();
  }

  private isValid(): boolean {
    return !!(
      this.formData.fullName?.trim() &&
      this.formData.email?.trim() &&
      this.formData.mobile?.trim()
    );
  }
}
