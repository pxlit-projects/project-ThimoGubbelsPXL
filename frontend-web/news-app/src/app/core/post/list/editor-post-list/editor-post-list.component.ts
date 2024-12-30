import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../../../shared/services/post.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CreatePostComponent } from '../../forms/create-post/create-post.component';
import { computed } from '@angular/core';
import { Post } from '../../../../shared/models/post';

@Component({
  selector: 'app-editor-post-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule, MatListModule,MatCardModule,
    MatListModule,
    MatButtonModule,],
  templateUrl: './editor-post-list.component.html',
  styleUrls: ['./editor-post-list.component.css']
})
export class EditorPostListComponent implements OnInit {
  postService: PostService = inject(PostService);
  dialog: MatDialog = inject(MatDialog);
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.getPosts();
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      width: '80vw',
      height: '80vh',
      panelClass: 'custom-dialog-container',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });

    dialogRef.componentInstance.postCreated.subscribe(() => {
      dialogRef.close();
      this.getPosts();
    });
  }


  getPosts(): void{
    this.postService.getPosts().subscribe({
      next: (posts: Post[]) => {
        this.postService.posts = posts;
        console.log(posts);
        this.postService.errorMessage.set(null);
      },
      error: (err:Error) => {
        this.postService.errorMessage.set("Error occured");
      }
    });
  }
}