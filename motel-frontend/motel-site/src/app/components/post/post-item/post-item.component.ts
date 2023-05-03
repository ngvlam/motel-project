import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/model/post';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit{
  @Input()
  post!: Post;

  isFavorite!: boolean;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.isFavorite = this.favoritesService.isPostInFavorites(this.post);
  }

  toggleFavorite() {

    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(this.post);
    } else {
      this.favoritesService.addToFavorites(this.post);
    }

    this.isFavorite = !this.isFavorite
  }
}
