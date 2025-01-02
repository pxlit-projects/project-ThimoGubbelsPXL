import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReviewService } from '../../../../shared/services/review.service';
import { AuthService } from '../../../../shared/services/auth.service';
@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.css'
})
export class CreateReviewComponent {
  reviewForm: FormGroup;
  reviewService: ReviewService = inject(ReviewService);
  authService: AuthService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: number, postAuthor: string }
  ) {
    this.reviewForm = this.fb.group({
      content: [''],
      approved: [false]
    });

    // Add conditional validation
    this.reviewForm.get('approved')?.valueChanges.subscribe(isApproved => {
      const contentControl = this.reviewForm.get('content');
      if (!isApproved) {
        contentControl?.setValidators([Validators.required]);
      } else {
        contentControl?.clearValidators();
      }
      contentControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      const review = {
        postId: this.data.postId,
        content: this.reviewForm.value.content,
        author: currentUser.username,
        postAuthor: this.data.postAuthor,
        approved: this.reviewForm.value.approved
      };

      this.reviewService.createReview(review).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating review:', error);
        }
      });
    }
  }
}
