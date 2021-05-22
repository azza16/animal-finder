import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.scss']
})
export class CreatePostDialogComponent implements OnInit {

  postForm: FormGroup;

  formData : FormData = new FormData();
  fileName = '';
  filePath: string;
  srcEncoded;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatePostDialogComponent>
  ) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      status: ['', Validators.required],
      location: ['', Validators.required],
      contactNumber: ['', Validators.required],
      species: ['', Validators.required],
      breed: [''],
      info: [''],
      contactName: [''],
      passphrase: ['', Validators.required],
    })
  }

  onFileSelected(event) {

    const file : File = event.target.files[0];

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
  
  createPost(){    
    Object.keys(this.postForm.controls).forEach(key => {
      this.formData.append(key, this.postForm.controls[key].value)
    });

    this.dialogRef.close(this.formData);
  }

}
