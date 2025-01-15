import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateReviewComponent } from './create-review.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReviewService } from '../../../../shared/services/review.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { of, throwError } from 'rxjs';

describe('CreateReviewComponent', () => {
  let component: CreateReviewComponent;
  let fixture: ComponentFixture<CreateReviewComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateReviewComponent>>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockDialogData = {
    postId: 1,
    postAuthor: 'testAuthor'
  };

  const mockUser = {
    username: 'testUser',
    password: 'hashedPassword123',
    role: 'editor'
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['createReview']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    reviewServiceSpy.createReview.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        CreateReviewComponent,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.reviewForm.value).toEqual({
      content: '',
      approved: false
    });
  });

  it('should validate content when not approved', () => {
    component.reviewForm.patchValue({ approved: false });
    expect(component.reviewForm.get('content')?.hasValidator(Validators.required)).toBeTrue();
  });

  it('should not validate content when approved', () => {
    component.reviewForm.patchValue({ approved: true });
    expect(component.reviewForm.get('content')?.hasValidator(Validators.required)).toBeFalse();
  });

  it('should submit form and close dialog when valid and approved', () => {
    component.reviewForm.patchValue({
      content: '',
      approved: true
    });

    component.onSubmit();

    expect(reviewServiceSpy.createReview).toHaveBeenCalledWith({
      postId: mockDialogData.postId,
      content: '',
      author: mockUser.username,
      postAuthor: mockDialogData.postAuthor,
      approved: true
    });
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should submit form with content when not approved', () => {
    component.reviewForm.patchValue({
      content: 'Review feedback',
      approved: false
    });

    component.onSubmit();

    expect(reviewServiceSpy.createReview).toHaveBeenCalledWith({
      postId: mockDialogData.postId,
      content: 'Review feedback',
      author: mockUser.username,
      postAuthor: mockDialogData.postAuthor,
      approved: false
    });
  });

  it('should handle error when creating review', () => {
    reviewServiceSpy.createReview.and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');

    component.reviewForm.patchValue({
      content: 'Review feedback',
      approved: false
    });

    component.onSubmit();

    expect(console.error).toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should not submit when user is not authenticated', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);

    component.onSubmit();

    expect(reviewServiceSpy.createReview).not.toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close dialog without result when cancelled', () => {
    component.dialogRef.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should cleanup subscriptions on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subs'] = [subscription];

    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});