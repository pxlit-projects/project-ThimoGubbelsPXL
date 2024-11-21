import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  api: string = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  createPost(post: Post) : Observable<Post> {

    return this.http.post<Post>(this.api + 'post/api/post', post);
  }
  
}
