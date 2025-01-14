import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    FormsModule,
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
  comment: string = '';
  

  constructor(
    public dialogRef: MatDialogRef<CreateCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: Number }
  ) {}

  onSubmit() : void {
    
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      const comment = {
        postId: this.data.postId,
        content: this.comment,
        author: currentUser.username,
        date: new Date()
      };

      this.dialogRef.close(comment);
    
  }
}