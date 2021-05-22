import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delete-post-dialog',
  templateUrl: './delete-post-dialog.component.html',
  styleUrls: ['./delete-post-dialog.component.scss']
})
export class DeletePostDialogComponent implements OnInit {

  private passphrase$ = new Subject<string>();
  match : boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialogRef: MatDialogRef<DeletePostDialogComponent>
  ) { }

  ngOnInit(): void {
    this.passphrase$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(d => {
      this.match = d === this.data.passphrase || d === environment.adminId;
    }); 
  }

  checkPassphraseMatch(passphrase) {
    this.passphrase$.next(passphrase);
  }

  onClickDelete() {
    this.dialogRef.close(this.data._id);
  }
}
