import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }

  getPosts(filters, nskip) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/posts`, {filters: filters, nskip: nskip})
  }

  createPost(post : FormData) {
    return this.http.post(`${environment.apiUrl}/posts/new`, post)
  }

  deletePost(id) {
    return this.http.delete(`${environment.apiUrl}/posts/${id}`);
  }

  approvePost(id) {
    return this.http.patch(`${environment.apiUrl}/posts/${id}`, {});
  }

  updatePost(id, post : FormData) {
    return this.http.put(`${environment.apiUrl}/posts/${id}`, post)
  }
}
