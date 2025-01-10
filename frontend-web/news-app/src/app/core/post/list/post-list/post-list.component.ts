import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../../../shared/services/post.service';
import { Post } from '../../../../shared/models/post';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    RouterModule
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  postService: PostService = inject(PostService);
  fb: FormBuilder = inject(FormBuilder);
  filterForm: FormGroup = this.fb.group({
    content: [''],
    author: [''],
    startDate: [''],
    endDate: ['']
  });
  posts: Post[] = [];
  totalPosts: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  subs: Subscription[] = [];

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    const { content, author, startDate, endDate } = this.filterForm.value;
    this.subs.push(this.postService.filterPosts(content, author, startDate, endDate, this.pageIndex, this.pageSize).subscribe({
      next: (page) => {
        this.postService.posts = page.content;
        this.totalPosts = page.totalElements;
      },
      error: (err) => {
        console.error('Error fetching posts', err);
      }
    }));
   
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPosts();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.getPosts();
  }

  ngOnDestroy(): void {
    if(this.subs){
      this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }
}