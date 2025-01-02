import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: { username: string, password: string, role: string } | null = null;

  constructor(private router: Router) {
    // Automatically log in a user for now
    this.authenticate('user1', 'password1',);
  }

  // Simulate a user database
  private users: { username: string, password: string, role:string }[] = [
    { username: 'user1', password: bcrypt.hashSync('password1', 10), role: 'editor' },
    { username: 'user2', password: bcrypt.hashSync('password2', 10),  role: 'user' },
    { username: 'user3', password: bcrypt.hashSync('password3', 10),  role: 'editor' }
  ];

  // Method to authenticate user
  authenticate(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  // Method to get the current user
  getCurrentUser(): { username: string, password: string, role: string } | null {
    return this.currentUser;
  }

  // Method to log out the current user
  logout(): void {
    this.currentUser = null;
    this.router.navigate(['/login']); // Redirect to login page on logout
  }
}