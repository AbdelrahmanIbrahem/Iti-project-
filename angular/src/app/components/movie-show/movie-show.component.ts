import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from 'src/app/models/movie.model';

@Component({
  selector: 'app-movie-show',
  templateUrl: './movie-show.component.html',
  styleUrls: ['./movie-show.component.css']
})
export class MovieShowComponent implements OnInit {
  currentMovie: Movie = {
    title: '',
    description: '',
    year: '',
    published: false
  };
  message = '';

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getMovie(this.route.snapshot.params.id);
  }

  getMovie(id: string): void {
    this.movieService.get(id)
      .subscribe(
        data => {
          this.currentMovie = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentMovie.title,
      description: this.currentMovie.description,
      year: this.currentMovie.year,
      published: status
    };

    this.message = '';

    this.movieService.update(this.currentMovie.id, data)
      .subscribe(
        response => {
          this.currentMovie.published = status;
          console.log(response);
          this.message = response.message ? response.message : 'This movie was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  updateMovie(): void {
    this.message = '';

    this.movieService.update(this.currentMovie.id, this.currentMovie)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message ? response.message : 'This movie was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deleteMovie(): void {
    this.movieService.delete(this.currentMovie.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/movies']);
        },
        error => {
          console.log(error);
        });
  }
}
