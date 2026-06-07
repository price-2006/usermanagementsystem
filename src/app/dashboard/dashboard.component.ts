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

  logout(): void {
    this.router.navigate(['/login']);
  }
}
