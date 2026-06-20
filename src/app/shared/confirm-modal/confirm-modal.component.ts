import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  /** Title shown in the modal header */
  @Input() title = 'Are you sure?';

  /** Body message */
  @Input() message = 'This action cannot be undone.';

  /** Label for the confirm button */
  @Input() confirmLabel = 'Delete';

  /** Whether the modal is visible */
  @Input() visible = false;

  /** Emitted when the user clicks Confirm */
  @Output() confirmed = new EventEmitter<void>();

  /** Emitted when the user clicks Cancel or the backdrop */
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('confirm-overlay')) {
      this.onCancel();
    }
  }
}
