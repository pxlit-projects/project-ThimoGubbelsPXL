// src/app/core/post/detail/post-comment/post-comment.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../../shared/models/comment';
import { AuthService } from '../../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, FormsModule],
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.css']
   
  
})
export class PostCommentComponent {
  @Input() comment!: Comment;
  @Output() commentUpdated = new EventEmitter<Comment>();
  @Output() commentDeleted = new EventEmitter<Number>();

  private authService = inject(AuthService);
  
  isEditing = false;
  editedContent = '';
  
  get canModify(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.username === this.comment.author;
  }

  startEdit(): void {
    this.isEditing = true;
    this.editedContent = this.comment.content;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedContent = '';
  }

  saveEdit(): void {
    if (this.editedContent !== this.comment.content) {
      const updatedComment = { ...this.comment, content: this.editedContent };
      this.commentUpdated.emit(updatedComment);
    }
    this.isEditing = false;
  }

  deleteComment(): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentDeleted.emit(this.comment.id);
    }
  }
}