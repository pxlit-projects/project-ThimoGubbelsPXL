// src/app/shared/services/notification.service.ts
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private eventSource: EventSource | undefined;
  private notificationSubject = new Subject<string>();


  private maxRetries = 5;
  private retryCount = 0;
  private retryInterval = 5000;
  private initialDelay = 2000;

  constructor(private ngZone: NgZone) { }

  connect(): Observable<string> {
    // Add delay before initial connection
    setTimeout(() => {
      this.setupEventSource();
    }, this.initialDelay);
    
    return this.notificationSubject.asObservable();
  }

  private setupEventSource() {
    this.ngZone.runOutsideAngular(() => {
      if (this.eventSource) {
        this.disconnect();
      }

      const url = new URL(`${environment.apiUrl}post/api/post/notifications`);
      this.eventSource = new EventSource(url.toString());
      
      this.eventSource.onmessage = (event) => {
        this.ngZone.run(() => {
          this.retryCount = 0;
          this.notificationSubject.next(event.data);
        });
      };

      this.eventSource.onopen = () => {
        this.retryCount = 0;
        console.log('SSE connection established');
      };

      this.eventSource.onerror = (error) => {
        this.ngZone.run(() => {
          
          this.handleError();
        });
      };
    });
 
  
  }

  private handleError() {
    this.disconnect();
    
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Retrying connection (${this.retryCount}/${this.maxRetries}) in ${this.retryInterval}ms`);
      
      setTimeout(() => {
        this.setupEventSource();
      }, this.retryInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
  }
}