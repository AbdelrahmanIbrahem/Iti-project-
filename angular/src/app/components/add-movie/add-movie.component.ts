import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie.service';

import { HttpEventType, HttpResponse } from '@angular/common/http'; //mk
import { Observable } from 'rxjs'; //mk

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})


export class AddMovieComponent implements OnInit {
  movie: Movie = {
    title: '',
    description: '',
    category:'',
    year: '',
    imgURL:'',
    published: false
  };
  submitted = false;


  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;


  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.fileInfos = this.movieService.getFiles();
  }

  //mk file code
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.movieService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.movie.imgURL = this.currentFile?.name;
              //this.fileInfos = this.movieService.getFiles();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }
      //this.selectedFiles = undefined;
    }
  }

  //mk end code


  saveMovie(): void {
    const data = {
      title: this.movie.title,
      description: this.movie.description,
      category: this.movie.category,
      year: this.movie.year,
      imgURL: this.movie.imgURL
    };

    this.movieService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newMovie(): void {
    this.submitted = false;
    this.movie = {
      title: '',
      description: '',
      category: '',
      year: '',
      imgURL: '',
      published: false
    };
  }

}
