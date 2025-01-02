// src/app/core/post/detail/editor-post-detail/editor-post-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../../../shared/services/post.service';
import { Post } from '../../../../shared/models/post';

@Component({
  selector: 'app-editor-post-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './editor-post-detail.component.html',
})
export class EditorPostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private snackBar = inject(MatSnackBar);
  
  post: Post | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost(id);
  }

  loadPost(id: number) {
   
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.post = posts.find(p => p.id === id) || null;
      },
      error: (err) => {
        console.error('Error fetching post details', err);
      }
    });
  }

  publishPost() {
    if (!this.post?.id) return;
    
    this.postService.publishPost(this.post.id).subscribe({
      next: () => {
        if (this.post) {
          this.post.published = true;
        }
        this.snackBar.open('Post published successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error publishing post', 'Close', { duration: 3000 });
      }
    });
  }
}