import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../../shared/services/post.service';
import { Post } from '../../../../shared/models/post';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  errorMessage: string | null = null;
  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    isConcept: [false]
  });
  postId: string | null = null;

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      const post = this.postService.posts().find(p => p.id === this.postId);
      if (post) {
        this.postForm.patchValue(post);
      }
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser !== null) {
        const role = currentUser.role;
        const newPost: Post = { ...this.postForm.value, author: currentUser.username, date: new Date() };
        if (this.postId) {
          this.postService.updatePost({ ...newPost, id: this.postId });
          this.router.navigate(['/posts']);
        } else {
          this.postService.createPost(newPost, role);
          this.postForm.reset();
        }
        this.errorMessage = null;
      } else {
        this.errorMessage = 'User not authenticated';
      }
    }
  }
}