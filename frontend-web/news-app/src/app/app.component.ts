// src/app/app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/navbar/navbar.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './shared/services/notification.service';
import { AuthService } from './shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private notificationSubscription?: Subscription;
   private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

 
  ngOnInit() {
    this.setupNotificationSubscription();
  }

  private setupNotificationSubscription() {
    this.notificationSubscription = this.notificationService.connect()
      .subscribe({
        next: (message) => {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser && message.includes(currentUser.username)) {
            this.snackBar.open(message, 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
          this.reconnectAttempts = 0; // Reset on successful message
        },
        error: (error) => {
          console.error('Notification error:', error);
          this.handleReconnect();
        }
      });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.setupNotificationSubscription();
      }, 5000 * this.reconnectAttempts); // Exponential backoff
    }
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    this.notificationService.disconnect();
  }
}