import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCommentComponent } from './create-comment.component';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../shared/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateCommentComponent', () => {
  let component: CreateCommentComponent;
  let fixture: ComponentFixture<CreateCommentComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateCommentComponent>>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockDialogData = {
    postId: 1
  };

  const mockUser = {
    username: 'testUser',
    password: 'hashedPassword123',
    role: 'user'
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [
        CreateCommentComponent,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty comment', () => {
    expect(component.comment).toBe('');
  });

  it('should submit form and close dialog with comment data when valid', () => {
    component.comment = 'Test comment';
    const expectedComment = {
      postId: mockDialogData.postId,
      content: 'Test comment',
      author: mockUser.username,
      date: jasmine.any(Date)
    };

    component.onSubmit();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(expectedComment);
  });

 

  it('should not submit when user is not authenticated', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);
    component.comment = 'Test comment';
    component.onSubmit();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close dialog without result when cancel is clicked', () => {
    const cancelButton = fixture.nativeElement.querySelector('button[type="button"]');
    cancelButton.click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});