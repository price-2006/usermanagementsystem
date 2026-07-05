import { Component, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
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
  private cdr = inject(ChangeDetectorRef);

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
    console.log('[Dashboard] loadUsers() called');
    this.isLoading = true;
    this.errorMessage = '';

    this.userStorage.getUsers().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (users) => {
        this.registeredUsers = users;
        if (users.length > 0) {
          this.userName = users[users.length - 1].fullName;
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load users. Is json-server running on port 3000?';
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
    const id = this.editingUser.id;
    this.editingUser = null;

    this.isLoading = true;
    this.errorMessage = '';

    this.userStorage.updateUser(id, updated).pipe(
      finalize(() => { this.isLoading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        this.errorMessage = err.message || 'Failed to update user.';
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
    const id = this.pendingDeleteUser.id;
    this.pendingDeleteUser = null;

    this.isLoading = true;
    this.errorMessage = '';

    this.userStorage.deleteUser(id).pipe(
      finalize(() => { this.isLoading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete user.';
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

    this.userStorage.saveUser(user).pipe(
      finalize(() => { this.isLoading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        this.errorMessage = err.message || 'Failed to add user.';
      }
    });
  }

  onCancelAdd(): void {}
}
