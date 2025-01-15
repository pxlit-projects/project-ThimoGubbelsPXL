import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './core/navbar/navbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './shared/services/notification.service';
import { AuthService } from './shared/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser = {
    username: 'test',
    password: 'hashedPass123',
    role: 'user'
  };

  beforeEach(async () => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['connect', 'disconnect']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NavbarComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show notification for authenticated user', () => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    notificationServiceSpy.connect.and.returnValue(of('New notification for test'));

    component.ngOnInit();

    expect(notificationServiceSpy.connect).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'New notification for test',
      'Close',
      {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      }
    );
  });



  it('should handle notification error', () => {
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    notificationServiceSpy.connect.and.returnValue(throwError(() => new Error('Connection error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should cleanup subscriptions on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['notificationSubscription'] = subscription;

    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
    expect(notificationServiceSpy.disconnect).toHaveBeenCalled();
  });
});