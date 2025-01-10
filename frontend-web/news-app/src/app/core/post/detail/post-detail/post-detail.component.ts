import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../../shared/services/post.service';
import { CommentService } from '../../../../shared/services/comment.service';
import { Post } from '../../../../shared/models/post';
import { Comment } from '../../../../shared/models/comment';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateCommentComponent } from '../../forms/create-comment/create-comment.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule, PostCommentComponent],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  postService: PostService = inject(PostService);
  commentService: CommentService = inject(CommentService);
  route: ActivatedRoute = inject(ActivatedRoute);
  post: Post |null= null;
  subs: Subscription[] = [];
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    this.subs.push(this.postService.getPublicPosts().subscribe({
      next: (page) => {
        this.post = page.content.find(p => p.id === postId) || null;
        console.log(this.post);
      },
      error: (err) => {
        console.error('Error fetching post details', err);
      }
    }));
  }

  

  onCommentUpdated(updatedComment: Comment) {
    if (this.post && this.post.comments) {
      
      this.commentService.updateComment(updatedComment).subscribe({next: (comment) => {
        const index = this.post!.comments.findIndex(c => c.id === updatedComment.id);
      if (index !== -1) {
        this.post!.comments[index] = comment;
      }
      }
    })
  }
}

  onCommentDeleted(commentId: Number) {
    if (this.post && this.post.comments) {
      
      this.commentService.deleteComment(commentId ).subscribe({next: () => {
        this.post!.comments = this.post!.comments.filter(c => c.id !== commentId);
    }})

  }
}

  openCreateCommentDialog() {
    if (!this.post) return;
    
    const dialogRef = this.dialog.open(CreateCommentComponent, {
      width: '500px',
      data: { postId: this.post.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentService.createComment(result).subscribe({
          next: (newComment) => {
            if (this.post && this.post.comments) {
              this.post.comments.push(newComment);
            }
          },
          error: (error) => {
            console.error('Error creating comment:', error);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if(this.subs){
      this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }
}