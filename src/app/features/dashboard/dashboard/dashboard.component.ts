import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserStorageService, RegisteredUser } from '../../../core/services/user-storage.service';
import { AddUserModalComponent } from '../../../shared/add-user-modal/add-user-modal.component';
import { setAuthenticated } from '../../../core/guards/auth.guard';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private userStorage = inject(UserStorageService);

  @ViewChild('addUserModal') addUserModal!: AddUserModalComponent;

  userName = 'User';
  activeMenu: 'dashboard' | 'users' = 'dashboard';
  registeredUsers: RegisteredUser[] = [];

  // Loading & Error
  isLoading = false;
  errorMessage = '';

  // Search
  private _searchQuery = '';
  get searchQuery(): string { return this._searchQuery; }
  set searchQuery(value: string) {
    this._searchQuery = value;
    this.currentPage = 1;
  }

  // Pagination
  currentPage = 1;
  readonly pageSize = 5;

  // Editing — null means modal is closed
  editingUser: RegisteredUser | null = null;

  // Confirm-delete modal
  pendingDeleteUser: RegisteredUser | null = null;
  get showConfirm(): boolean { return this.pendingDeleteUser !== null; }

  // ── Computed ──────────────────────────────────────────────────────────────

  get filteredUsers(): RegisteredUser[] {
    if (!this._searchQuery.trim()) return this.registeredUsers;
    const query = this._searchQuery.toLowerCase().trim();
    return this.registeredUsers.filter(u =>
      u.fullName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  get displayedUsers(): RegisteredUser[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userStorage.getUsers().subscribe({
      next: (users) => {
        this.registeredUsers = users;
        if (users.length > 0) {
          this.userName = users[users.length - 1].fullName;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  setMenu(menu: 'dashboard' | 'users'): void {
    this.activeMenu = menu;
  }

  logout(): void {
    setAuthenticated(false);
    this.router.navigate(['/login']);
  }

  // ── Pagination ────────────────────────────────────────────────────────────

  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage(): void { if (this.currentPage > 1) this.currentPage--; }
  goToPage(page: number): void { this.currentPage = page; }

  // ── User CRUD (delegated from child components) ───────────────────────────

  openEditModal(user: RegisteredUser): void {
    this.editingUser = { ...user };
  }

  onSaveEdit(updated: RegisteredUser): void {
    if (!this.editingUser?.id) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.userStorage.updateUser(this.editingUser.id, updated).subscribe({
      next: () => {
        this.editingUser = null;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to update user.';
        this.isLoading = false;
      }
    });
  }

  onCancelEdit(): void {
    this.editingUser = null;
  }

  onDeleteUser(user: RegisteredUser): void {
    this.pendingDeleteUser = user;
  }

  onConfirmDelete(): void {
    if (!this.pendingDeleteUser?.id) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.userStorage.deleteUser(this.pendingDeleteUser.id).subscribe({
      next: () => {
        this.pendingDeleteUser = null;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete user.';
        this.isLoading = false;
      }
    });
  }

  onCancelDelete(): void {
    this.pendingDeleteUser = null;
  }

  // ── Add User ──────────────────────────────────────────────────────────────

  openAddUserModal(): void {
    this.addUserModal.open();
  }

  onAddUser(user: RegisteredUser): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userStorage.saveUser(user).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to add user.';
        this.isLoading = false;
      }
    });
  }

  onCancelAdd(): void {}
}
