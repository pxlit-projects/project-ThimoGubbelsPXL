import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../../../shared/services/post.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePostComponent } from '../../forms/create-post/create-post.component';
import { Post } from '../../../../shared/models/post';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-editor-post-list',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule],
  templateUrl: './editor-post-list.component.html',
  styleUrls: ['./editor-post-list.component.css']
})
export class EditorPostListComponent implements OnInit {
  postService: PostService = inject(PostService);
  dialog: MatDialog = inject(MatDialog);
  posts : Signal<Post[]> = computed(() => this.postService.posts());

  ngOnInit(): void {
    this.postService.getPosts();
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.postService.getPosts();
    });
  }
}