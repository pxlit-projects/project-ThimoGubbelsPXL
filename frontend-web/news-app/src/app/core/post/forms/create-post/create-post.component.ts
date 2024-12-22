import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../../shared/services/post.service';
import { Post } from '../../../../shared/models/post';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  fb: FormBuilder = inject(FormBuilder);
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  sub!: Subscription;
  errorMessage: string | null = null;

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.postForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if(currentUser !== null) {
      const role = currentUser.role;
      const newPost: Post = { ...this.postForm.value, author: currentUser?.username, date: new Date() };
      this.sub = this.postService.createPost(newPost, role).subscribe({
        next: (response) => {
          this.postForm.reset();
          this.errorMessage = null;
        },
        error: (error) => {
          this.errorMessage = "Not able to create post, are you authorized?";
        }
      });
    }}else{
      this.errorMessage = 'User not authenticated';
    }
  }
}