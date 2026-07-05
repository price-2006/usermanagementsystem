import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RegisteredUser {
  id?: number;
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
  private readonly apiUrl = '/users';
  private http = inject(HttpClient);

  /** GET /users */
  getUsers(): Observable<RegisteredUser[]> {
    return this.http.get<RegisteredUser[]>(this.apiUrl).pipe(
      catchError(err => throwError(() => new Error(err.message || 'Failed to fetch users')))
    );
  }

  /** POST /users */
  saveUser(user: RegisteredUser): Observable<RegisteredUser> {
    return this.http.post<RegisteredUser>(this.apiUrl, user).pipe(
      catchError(err => throwError(() => new Error(err.message || 'Failed to save user')))
    );
  }

  /** PUT /users/:id */
  updateUser(id: number, updatedUser: RegisteredUser): Observable<RegisteredUser> {
    return this.http.put<RegisteredUser>(`${this.apiUrl}/${id}`, updatedUser).pipe(
      catchError(err => throwError(() => new Error(err.message || 'Failed to update user')))
    );
  }

  /** DELETE /users/:id */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => new Error(err.message || 'Failed to delete user')))
    );
  }
}
