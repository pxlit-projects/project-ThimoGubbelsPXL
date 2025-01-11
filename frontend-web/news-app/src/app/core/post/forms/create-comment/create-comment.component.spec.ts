import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCommentComponent } from './create-comment.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
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

  it('should initialize with empty form', () => {
    expect(component.commentForm.get('content')?.value).toBe('');
    expect(component.commentForm.valid).toBeFalse();
  });

  it('should show validation error when content is empty', () => {
    const contentControl = component.commentForm.get('content');
    contentControl?.setValue('');
    contentControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Comment content is required');
  });

  it('should be valid when content is provided', () => {
    const contentControl = component.commentForm.get('content');
    contentControl?.setValue('Test comment content');
    fixture.detectChanges();

    expect(component.commentForm.valid).toBeTrue();
  });

  it('should close dialog without result when cancel is clicked', () => {
    const cancelButton = fixture.nativeElement.querySelector('button[type="button"]');
    cancelButton.click();
    
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('should submit form and close dialog with comment data when valid', () => {
    const expectedComment = {
      postId: mockDialogData.postId,
      content: 'Test comment',
      author: mockUser.username,
      date: jasmine.any(Date)
    };

    component.commentForm.setValue({ content: 'Test comment' });
    component.onSubmit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(expectedComment);
  });

  it('should not submit when form is invalid', () => {
    component.commentForm.setValue({ content: '' });
    component.onSubmit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should not submit when user is not authenticated', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);
    component.commentForm.setValue({ content: 'Test comment' });
    component.onSubmit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should properly handle authenticated user with all properties', () => {
    const fullUser = {
      username: 'testUser',
      password: 'hashedPassword123',
      role: 'user'
    };
    authServiceSpy.getCurrentUser.and.returnValue(fullUser);

    component.commentForm.setValue({ content: 'Test comment' });
    component.onSubmit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      postId: mockDialogData.postId,
      content: 'Test comment',
      author: fullUser.username,
      date: jasmine.any(Date)
    });
  });
});

