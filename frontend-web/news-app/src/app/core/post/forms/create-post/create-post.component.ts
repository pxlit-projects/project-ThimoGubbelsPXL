import { Component, inject, Inject, OnInit } from '@angular/core';
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

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });


  onSubmit(): void {
    if (this.postForm.valid) {
      const newPost: Post = { ...this.postForm.value, author: this.authService.getCurrentUser()?.username, date: new Date() };
      this.sub = this.postService.createPost(newPost).subscribe({
        next: (response) => {
          this.postForm.reset();
        }
      });
    }
  }
}