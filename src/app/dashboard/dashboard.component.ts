import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserStorageService, RegisteredUser } from '../user-storage.service';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { UserTableComponent } from '../shared/user-table/user-table.component';
import { UserFormModalComponent } from '../shared/user-form-modal/user-form-modal.component';
import { ThemeToggleComponent } from '../shared/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, UserTableComponent, UserFormModalComponent, ThemeToggleComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private userStorage = inject(UserStorageService);

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
    if (window.confirm('Are you sure you want to delete?')) {
      this.userStorage.deleteUser(user.email);
      this.registeredUsers = this.userStorage.getUsers();
    }
  }
}
