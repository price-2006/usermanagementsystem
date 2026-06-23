import { Injectable } from '@angular/core';

export interface RegisteredUser {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  gender: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private readonly storageKey = 'users';

  getUsers(): RegisteredUser[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const rawUsers = window.localStorage.getItem(this.storageKey);

    if (!rawUsers) {
      return [];
    }

    try {
      const parsedUsers = JSON.parse(rawUsers) as RegisteredUser[];
      return Array.isArray(parsedUsers) ? parsedUsers : [];
    } catch {
      return [];
    }
  }

  saveUser(user: RegisteredUser): void {
    const users = this.getUsers();
    users.push(user);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(users));
    }
  }

  updateUser(email: string, updatedUser: RegisteredUser): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
      users[index] = updatedUser;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.storageKey, JSON.stringify(users));
      }
    }
  }

  deleteUser(email: string): void {
    let users = this.getUsers();
    users = users.filter(u => u.email !== email);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(users));
    }
  }
}
