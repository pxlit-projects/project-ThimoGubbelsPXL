import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../../../shared/services/post.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser = {
    username: 'testUser',
    password: 'testPass', // Added missing password
    role: 'editor'
  };

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'testUser',
    date: new Date(),
    concept: false,
    approved: false,
    published: false,
    review: null,
    comments: []
  };

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['createPost', 'updatePost', 'getPosts']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    
    // Fixed ActivatedRoute mock
    const activatedRouteMock = {
      snapshot: {
        paramMap: convertToParamMap({ id: null })
      }
    };

    await TestBed.configureTestingModule({
    
      imports: [
        CreatePostComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    fixture.detectChanges();
    expect(component.postForm.value).toEqual({
      title: '',
      content: '',
      concept: false
    });
  });

  it('should be invalid when form is empty', () => {
    fixture.detectChanges();
    expect(component.postForm.valid).toBeFalsy();
  });

  it('should be valid when form is filled', () => {
    fixture.detectChanges();
    component.postForm.patchValue({
      title: 'Test Title',
      content: 'Test Content',
      concept: false
    });
    expect(component.postForm.valid).toBeTruthy();
  });

 

  it('should handle error when creating post fails', () => {
    postServiceSpy.createPost.and.returnValue(throwError(() => 'Error'));
    fixture.detectChanges();
    
    component.postForm.patchValue({
      title: 'Test Title',
      content: 'Test Content',
      concept: false
    });
    
    component.onSubmit();
    
    expect(postServiceSpy.createPost).toHaveBeenCalled();
    expect(component.postService.errorMessage).toBeTruthy();
  });

  it('should handle unauthorized user', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    
    component.postForm.patchValue({
      title: 'Test Title',
      content: 'Test Content',
      concept: false
    });
    
    component.onSubmit();
    
    expect(postServiceSpy.createPost).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('User not authenticated');
  });

  

  it('should clean up subscriptions on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subs'] = [subscription];
    
    component.ngOnDestroy();
    
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});