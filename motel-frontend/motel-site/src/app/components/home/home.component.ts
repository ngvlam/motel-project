import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/model/page';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  page: Page<any> = new Page<any>();

  sort: string = ''

  loading = false;

  posts: Post[] = [];

  constructor(private postService: PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.sort = 'updatedAt,desc'
  }

  ngOnInit(): void {
    this.getAllPost(1);
  }

  getAllPost(pageNumber: number) {
    this.postService.getAllPostApproved(pageNumber - 1, this.sort).subscribe({
      next: data => {
        this.page = data
        this.posts = data.content;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getPage(page: number) {
    this.router.navigate(['/home'], {queryParams: {page}, skipLocationChange: false});
  }

  filterPost(){
    this.getAllPost(1)
  }

  isFavorite= false;

  toggleFavorite(event: any) {
    this.isFavorite = !this.isFavorite
  }
}
