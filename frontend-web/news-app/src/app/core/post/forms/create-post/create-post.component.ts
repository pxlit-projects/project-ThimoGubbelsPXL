import { Component, computed, inject, OnInit, Signal,EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../../shared/services/post.service';
import { Post } from '../../../../shared/models/post';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {
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
  postId: Number | null = null;
  subs: Subscription[] = [];

  @Output() postCreated = new EventEmitter<void>();

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.getPosts();
    console.log(this.postId);
    if (this.postId) {
      const post = this.postService.posts.find((p : Post) => p.id === this.postId);

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
        console.log(newPost);
        if (this.postId) {
          this.subs.push(this.postService.updatePost(newPost, this.postId).subscribe({
            next: () => {
              this.router.navigate(['/posts']);
              this.postService.errorMessage=null;
            },
            error: (err: Error) => {
              this.postService.errorMessage= "Error occured";
            }
          }));
        } else {
          this.subs.push(this.postService.createPost(newPost).subscribe({
            next: () => {
              this.postForm.reset();
              this.postCreated.emit();
              this.postService.errorMessage= null;
            },
            error: (err: Error) => {
              this.postService.errorMessage= "Error occured";
            }
          }));
        }
      } else {
        this.errorMessage = 'User not authenticated';
      }
    }
  }

  ngOnDestroy(): void {
    if(this.subs){
      this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }
}