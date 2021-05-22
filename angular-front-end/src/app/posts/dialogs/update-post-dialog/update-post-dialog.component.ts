import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-post-dialog',
  templateUrl: './update-post-dialog.component.html',
  styleUrls: ['./update-post-dialog.component.scss']
})
export class UpdatePostDialogComponent implements OnInit {

  private passphrase$ = new Subject<string>();
  match: boolean;

  updateForm: FormGroup;
  formData: FormData = new FormData();

  fileName = '';
  filePath: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdatePostDialogComponent>,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.passphrase$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(d => {
      this.match = d === this.data.passphrase || d === environment.adminId;
    });

    this.updateForm = this.fb.group({
      status: [this.data.status, Validators.required],
      location: [this.data.location, Validators.required],
      contactNumber: [this.data.contactNumber, Validators.required],
      species: [this.data.species, Validators.required],
      breed: [this.data.breed],
      info: [this.data.info],
      contactName: [this.data.contactName],
      passphrase: [this.data.passphrase]
    })

    this.fileName = this.data.image;
    this.filePath = this.data.image;
  }

  onFileSelected(event) {

    const file: File = event.target.files[0];

    if (file) {

      this.fileName = file.name;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.filePath = reader.result as string;
      }

      const imgElement = document.getElementById("img-input");      
      imgElement.onload = (e) => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 200;
        
        canvas.width = MAX_WIDTH;
        canvas.height = MAX_HEIGHT;
        
        const ctx = canvas.getContext("2d");
        
        ctx.drawImage(e.target as CanvasImageSource, 0, 0, canvas.width, canvas.height);
        
        ctx.canvas.toBlob((blob) => {
          this.formData.append("file", blob, this.fileName);
          // this.srcEncoded = blob;
        }, "image/jpeg")
      };
    }
  }

  checkPassphraseMatch(passphrase) {
    this.passphrase$.next(passphrase);    
  }

  onClickSaveChanges() {
    Object.keys(this.updateForm.controls).forEach(key => {
      this.formData.append(key, this.updateForm.controls[key].value)
    });
    
    this.dialogRef.close({id: this.data._id, formData: this.formData});
  }

}
