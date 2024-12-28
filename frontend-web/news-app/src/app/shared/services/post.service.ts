import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  api: string = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  private postsSignal = signal<Post[]>([]);
  posts = computed(() => this.postsSignal());

  createPost(post: Post, role: string) : Observable<Post> {
    const headers = new HttpHeaders().set('Role', role);
    return this.http.post<Post>(this.api + 'post/api/post', post,{ headers });
  }
  
  updatePost(post: Post): void {
    this.http.put<Post>(this.api + `post/api/post/${post.id}`, post).subscribe((updatedPost) => {
      const updatedPosts = this.postsSignal().map(p => p.id === updatedPost.id ? updatedPost : p);
      this.postsSignal.set(updatedPosts);
    });
  }

  getPosts(): void {
    this.http.get<Post[]>(this.api + 'post/api/posts').subscribe((posts) => {
      this.postsSignal.set(posts);
    });
  }
  
}
