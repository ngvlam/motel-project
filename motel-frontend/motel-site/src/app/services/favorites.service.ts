import { Injectable } from '@angular/core';
import { Post } from '../model/post';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritePosts: Post[] = [];
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0)

  constructor() {
    this.loadFavoritePosts();
    this.totalQuantity.next(this.favoritePosts.length)
  }

  addToFavorites(post: Post) {
    if (!this.isPostInFavorites(post)) {
      this.favoritePosts.push(post);
      this.saveFavoritePosts();
      this.totalQuantity.next(this.favoritePosts.length)
    }
  }

  removeFromFavorites(post: Post) {
    const index = this.favoritePosts.findIndex(f => f.id == post.id);
    if (index !== -1) {
      this.favoritePosts.splice(index, 1);
      this.saveFavoritePosts();
      this.totalQuantity.next(this.favoritePosts.length)
    }
  }

  getFavoritePosts(): Post[] {
    return this.favoritePosts;
  }

  isPostInFavorites(post: Post): boolean {
    return this.favoritePosts.some(p => p.id == post.id);
  }

  private saveFavoritePosts() {
    localStorage.setItem('favoritePosts', JSON.stringify(this.favoritePosts));
  }

  private loadFavoritePosts() {
    const favoritePostsString = localStorage.getItem('favoritePosts');
    if (favoritePostsString) {
      this.favoritePosts = JSON.parse(favoritePostsString);
    }
  }
}
