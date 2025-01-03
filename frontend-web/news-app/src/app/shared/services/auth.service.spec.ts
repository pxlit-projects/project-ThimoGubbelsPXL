import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: spy }
      ]
    });
    service = TestBed.inject(AuthService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    // Reset currentUser before each test
    service['currentUser'] = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate valid user', () => {
    const password = 'password1';
    const hashedPassword = bcrypt.hashSync(password, 10);
    service['users'] = [{ username: 'user1', password: hashedPassword, role: 'editor' }];
    
    const result = service.authenticate('user1', password);
    expect(result).toBeTruthy();
    expect(service.getCurrentUser()).toBeTruthy();
    expect(service.getCurrentUser()?.username).toBe('user1');
    expect(service.getCurrentUser()?.role).toBe('editor');
  });

  it('should not authenticate invalid password', () => {
    const password = 'password1';
    const hashedPassword = bcrypt.hashSync(password, 10);
    service['users'] = [{ username: 'user1', password: hashedPassword, role: 'editor' }];
    
    const result = service.authenticate('user1', 'wrongpassword');
    expect(result).toBeFalsy();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should not authenticate non-existent user', () => {
    const result = service.authenticate('nonexistent', 'password1');
    expect(result).toBeFalsy();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should get current user after authentication', () => {
    const password = 'password1';
    const hashedPassword = bcrypt.hashSync(password, 10);
    service['users'] = [{ username: 'user1', password: hashedPassword, role: 'editor' }];
    
    service.authenticate('user1', password);
    const user = service.getCurrentUser();
    expect(user).toBeTruthy();
    expect(user?.username).toBe('user1');
    expect(user?.role).toBe('editor');
  });

  it('should return null for current user when not authenticated', () => {
    const user = service.getCurrentUser();
    expect(user).toBeNull();
  });

  it('should logout user and redirect to login page', () => {
    const password = 'password1';
    const hashedPassword = bcrypt.hashSync(password, 10);
    service['users'] = [{ username: 'user1', password: hashedPassword, role: 'editor' }];
    
    service.authenticate('user1', password);
    expect(service.getCurrentUser()).toBeTruthy();
    
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});