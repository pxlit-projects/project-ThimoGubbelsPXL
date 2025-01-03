import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { PostService } from '../../../../shared/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Post } from '../../../../shared/models/post';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['getPosts']);
    const routeMock = { snapshot: { paramMap: { get: () => '1' } } };

    await TestBed.configureTestingModule({
      imports: [PostDetailComponent, MatCardModule, MatButtonModule, RouterTestingModule],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post details on init', () => {
    const mockPost: Post = { id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false, approved: false, published: false, review: null };
    postServiceSpy.getPosts.and.returnValue(of([mockPost]));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.post).toEqual(mockPost);
  });

  it('should handle error when loading post details', () => {
    postServiceSpy.getPosts.and.returnValue(throwError(() => new Error('Error occurred')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.post).toBeNull();
  });
});