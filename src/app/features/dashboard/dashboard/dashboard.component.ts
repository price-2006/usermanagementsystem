import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserStorageService, RegisteredUser } from '../../../core/services/user-storage.service';
import { AddUserModalComponent } from '../../../shared/add-user-modal/add-user-modal.component';

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

  // Search
  private _searchQuery = '';
  get searchQuery(): string { return this._searchQuery; }
  set searchQuery(value: string) {
    this._searchQuery = value;
    this.currentPage = 1; // reset to first page on every search
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
    this.registeredUsers = this.userStorage.getUsers();
    if (this.registeredUsers.length > 0) {
      this.userName = this.registeredUsers[this.registeredUsers.length - 1].fullName;
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  setMenu(menu: 'dashboard' | 'users'): void {
    this.activeMenu = menu;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isLoggedIn');
      window.localStorage.removeItem('currentUser');
    }
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
    if (this.editingUser) {
      this.userStorage.updateUser(this.editingUser.email, updated);
      this.editingUser = null;
      this.registeredUsers = this.userStorage.getUsers();
    }
  }

  onCancelEdit(): void {
    this.editingUser = null;
  }

  onDeleteUser(user: RegisteredUser): void {
    this.pendingDeleteUser = user;
  }

  onConfirmDelete(): void {
    if (this.pendingDeleteUser) {
      this.userStorage.deleteUser(this.pendingDeleteUser.email);
      this.registeredUsers = this.userStorage.getUsers();
      this.pendingDeleteUser = null;
    }
  }

  onCancelDelete(): void {
    this.pendingDeleteUser = null;
  }

  // ── Add User ──────────────────────────────────────────────────────────────

  openAddUserModal(): void {
    this.addUserModal.open();
  }

  onAddUser(user: RegisteredUser): void {
    this.userStorage.saveUser(user);
    this.registeredUsers = this.userStorage.getUsers();
  }

  onCancelAdd(): void {}
}
