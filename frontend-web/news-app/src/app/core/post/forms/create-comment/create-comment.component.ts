import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-create-comment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './create-comment.component.html'
})
export class CreateCommentComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);

  commentForm: FormGroup = this.fb.group({
    content: ['', Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<CreateCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: Number }
  ) {}

  onSubmit() {
    if (this.commentForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      const comment = {
        postId: this.data.postId,
        content: this.commentForm.value.content,
        author: currentUser.username,
        date: new Date()
      };

      this.dialogRef.close(comment);
    }
  }
}