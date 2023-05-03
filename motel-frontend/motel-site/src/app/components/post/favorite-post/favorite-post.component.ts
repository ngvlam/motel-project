import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/model/post';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-favorite-post',
  templateUrl: './favorite-post.component.html',
  styleUrls: ['./favorite-post.component.css']
})
export class FavoritePostComponent implements OnInit{
  
  posts: Post[] = []

  constructor(private favoriteService: FavoritesService) {}

  ngOnInit(): void {
    this.posts = this.favoriteService.getFavoritePosts()
  }
  
}
