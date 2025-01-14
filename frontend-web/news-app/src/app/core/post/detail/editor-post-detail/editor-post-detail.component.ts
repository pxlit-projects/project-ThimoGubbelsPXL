// src/app/core/post/detail/editor-post-detail/editor-post-detail.component.ts
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../../../shared/services/post.service';
import { Post } from '../../../../shared/models/post';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor-post-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './editor-post-detail.component.html',
})
export class EditorPostDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  postService = inject(PostService);
  private snackBar = inject(MatSnackBar);
  private subs: Subscription[] = [];
  
  post: Post | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost(id);
  }

  loadPost(id: number) {
   
    this.subs.push(this.postService.getPosts().subscribe({
      next: (posts) => {
        this.post = posts.find(p => p.id === id) || null;
      },
      error: (err) => {
        this.postService.errorMessage = err;
      }
    }));
  }

  publishPost() {
    if (!this.post?.id) return;
    
    this.subs.push(this.postService.publishPost(this.post.id).subscribe({
      next: () => {
        if (this.post) {
          this.post.published = true;
        }
        this.snackBar.open('Post published successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.postService.errorMessage = error;
        this.snackBar.open('Error publishing post', 'Close', { duration: 3000 });
      }
    }));
  }

  ngOnDestroy(): void {
    if(this.subs){
      this.subs.forEach((sub) => sub.unsubscribe());
    }
  }
}