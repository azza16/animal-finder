import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { UpdatePostDialogComponent } from './dialogs/update-post-dialog/update-post-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreatePostDialogComponent } from './dialogs/create-post-dialog/create-post-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeletePostDialogComponent } from './dialogs/delete-post-dialog/delete-post-dialog.component';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    InfiniteScrollModule,
  ],
  declarations: [
    PostsComponent,
    UpdatePostDialogComponent,
    CreatePostDialogComponent,
    DeletePostDialogComponent,
    DateAgoPipe,
  ],
})
export class PostsModule { }
