import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStorageService, RegisteredUser } from '../user-storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private userStorage = inject(UserStorageService);

  userName = 'User';
  activeMenu: 'dashboard' | 'users' = 'dashboard';
  registeredUsers: RegisteredUser[] = [];
  searchQuery = '';
  editingUserEmail: string | null = null;
  editFormData: Partial<RegisteredUser> = {};

  get displayedUsers(): RegisteredUser[] {
    if (!this.searchQuery.trim()) {
      return this.registeredUsers;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.registeredUsers.filter(u => 
      u.fullName.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
  }

  ngOnInit(): void {
    this.registeredUsers = this.userStorage.getUsers();
    if (this.registeredUsers.length > 0) {
      this.userName = this.registeredUsers[this.registeredUsers.length - 1].fullName;
    }
  }

  setMenu(menu: 'dashboard' | 'users') {
    this.activeMenu = menu;
  }

  editUser(user: RegisteredUser) {
    this.editingUserEmail = user.email;
    this.editFormData = { ...user };
  }

  saveEdit() {
    if (this.editingUserEmail && this.editFormData.email) {
      this.userStorage.updateUser(this.editingUserEmail, this.editFormData as RegisteredUser);
      this.editingUserEmail = null;
      this.editFormData = {};
      this.registeredUsers = this.userStorage.getUsers();
    }
  }

  cancelEdit() {
    this.editingUserEmail = null;
    this.editFormData = {};
  }

  deleteUser(user: RegisteredUser) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.userStorage.deleteUser(user.email);
      this.registeredUsers = this.userStorage.getUsers();
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isLoggedIn');
      window.localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }
}
