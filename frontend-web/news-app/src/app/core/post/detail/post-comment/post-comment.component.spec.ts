import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCommentComponent } from './post-comment.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { Comment } from '../../../../shared/models/comment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PostCommentComponent', () => {
  let component: PostCommentComponent;
  let fixture: ComponentFixture<PostCommentComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockComment: Comment = {
    id: 1,
    postId: 1,
    content: 'Test Comment',
    author: 'testUser',
    date: new Date()
  };

  const mockUser = {
    username: 'testUser',
    password: 'hashedPassword123',
    role: 'user'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authSpy.getCurrentUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [
        PostCommentComponent,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostCommentComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    // Set required input
    component.comment = mockComment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display comment content and author', () => {
    const content = fixture.nativeElement.querySelector('p');
    const authorInfo = fixture.nativeElement.querySelector('.text-sm');
    
    expect(content.textContent).toContain(mockComment.content);
    expect(authorInfo.textContent).toContain(mockComment.author);
  });

  it('should show edit/delete buttons when user is comment author', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2); // Edit and Delete buttons
    expect(component.canModify).toBeTrue();
  });

  it('should not show edit/delete buttons when user is not comment author', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ 
      username: 'otherUser',
      password: 'hashedPassword123',
      role: 'user'
    });

    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(0);
    expect(component.canModify).toBeFalse();
  });

  

  it('should cancel edit mode and restore original content', () => {
    component.startEdit();
    fixture.detectChanges();
    
    component.editedContent = 'Changed content';
    component.cancelEdit();
    fixture.detectChanges();

    expect(component.isEditing).toBeFalse();
    expect(component.editedContent).toBe('');
  });

  it('should emit updated comment when save is clicked', () => {
    spyOn(component.commentUpdated, 'emit');
    component.startEdit();
    component.editedContent = 'Updated content';
    
    component.saveEdit();

    expect(component.commentUpdated.emit).toHaveBeenCalledWith({
      ...mockComment,
      content: 'Updated content'
    });
    expect(component.isEditing).toBeFalse();
  });

  it('should not emit update if content is unchanged', () => {
    spyOn(component.commentUpdated, 'emit');
    component.startEdit();
    component.editedContent = mockComment.content;
    
    component.saveEdit();

    expect(component.commentUpdated.emit).not.toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
  });

  it('should emit delete event when delete is confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.commentDeleted, 'emit');
    
    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    deleteButton.click();

    expect(component.commentDeleted.emit).toHaveBeenCalledWith(mockComment.id);
  });

  it('should not emit delete event when delete is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.commentDeleted, 'emit');
    
    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    deleteButton.click();

    expect(component.commentDeleted.emit).not.toHaveBeenCalled();
  });
});