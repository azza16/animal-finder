import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CreatePostDialogComponent } from './dialogs/create-post-dialog/create-post-dialog.component';
import { DeletePostDialogComponent } from './dialogs/delete-post-dialog/delete-post-dialog.component';
import { UpdatePostDialogComponent } from './dialogs/update-post-dialog/update-post-dialog.component';
import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts: Post[] = [];
  finishedLoading : boolean = false;

  nskip = 0;
  filters = {
    'approved': true
  };

  isAdmin: boolean = false;

  constructor(
    private postsService: PostsService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id === environment.adminId) {
      this.isAdmin = true;
      this.filters['approved'] = false;
    }

    this.postsService.getPosts(this.filters, this.nskip).subscribe(posts => {
      this.posts = posts;
      this.finishedLoading = true;
    })
  }


  createPost() {
    const createPostDialogRef = this.dialog.open(CreatePostDialogComponent);
    
    createPostDialogRef.afterClosed().subscribe(formData => {
      if (formData)
      this.postsService.createPost(formData).subscribe(res => {
          this.toastr.success(
            'Post will become visible once approved.', 
            'Post created successfully!', 
            { 
              progressBar: true, 
              timeOut: 5000,
              closeButton: true
            }
          );          
        })
    });
  }

  onClickUpdate(post) {
    const updatePostDialogRef = this.dialog.open(UpdatePostDialogComponent, {
      data: post
    });

    updatePostDialogRef.afterClosed().subscribe(result => {
      if (result)
        this.postsService.updatePost(result['id'], result['formData']).subscribe(res => {
          this.posts = this.posts.filter(p => p._id !== result['id']);
          this.toastr.info(
            'Post will become visible once approved.', 
            'Post updated successfully!', 
            { 
              progressBar: true, 
              timeOut: 5000,
              closeButton: true
            }
          );
        })
    });
  }

  onClickRemove(post) {
    const deletePostDialogRef = this.dialog.open(DeletePostDialogComponent, {
      data: post
    });

    deletePostDialogRef.afterClosed().subscribe(id => {
      if (id)
        this.postsService.deletePost(id).subscribe(res => {
          this.posts = this.posts.filter(p => p._id !== id);
          this.toastr.info(
            '', 'Post deleted successfully!',
            { 
              progressBar: true, 
              timeOut: 5000,
              closeButton: true,
            }
          );
        })
    });
  }

  onScroll() {
    this.nskip += 10;
    this.postsService.getPosts(this.filters, this.nskip).subscribe(posts => this.posts.push(...posts));
  }

  filterPosts(k, v) {
    this.nskip = 0;

    if (v !== '' && v !== 'all') {
      switch (k) {
        case 'date':
          const dateNow = new Date().getTime();
          switch (v) {
            case 'now':
              this.filters[k] = { $gt: dateNow - (1000 * 60 * 10) };
              break;
            case 'today':
              this.filters[k] = { $gt: dateNow - (1000 * 60 * 60 * 24) };
              break;
            case 'week':
              this.filters[k] = { $gt: dateNow - (1000 * 60 * 60 * 24 * 7) };
              break;
            case 'month':
              this.filters[k] = { $gt: dateNow - (1000 * 60 * 60 * 24 * 31) };
              break;
            case 'year':
              this.filters[k] = { $gt: dateNow - (1000 * 60 * 60 * 24 * 365) };
              break;
            default:
              break;
          }
          break;
        case 'status':
          this.filters[k] = v;
          break;
        case 'location':
          this.filters[k] = { $regex: `^${v}`, $options: 'i' };
          break;
        case 'species':
          this.filters[k] = { $regex: `^${v}`, $options: 'i' };
          break;
        case 'approved':
          this.filters[k] = v;
          break;
        default:
          break;
      }
    }
    else {
      delete this.filters[k];
    }

    this.postsService.getPosts(this.filters, this.nskip).subscribe(posts => this.posts = posts);
  }

  approvePost(postId) {
    this.postsService.approvePost(postId).subscribe(res => {
      this.posts = this.posts.filter(p => p._id !== postId);
    })
  }
}
