import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisteredUser } from '../../user-storage.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {
  /** The slice of users for the current page */
  @Input() users: RegisteredUser[] = [];

  /** Total count of filtered users (used for pagination info) */
  @Input() filteredCount = 0;

  /** Pagination state */
  @Input() currentPage = 1;
  @Input() pageSize = 5;
  @Input() totalPages = 1;
  @Input() pageNumbers: number[] = [];

  @Output() editUser = new EventEmitter<RegisteredUser>();
  @Output() deleteUser = new EventEmitter<RegisteredUser>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() prevPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
}
