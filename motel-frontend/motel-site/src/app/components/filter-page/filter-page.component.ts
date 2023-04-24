import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/model/page';
import { Post } from 'src/app/model/post';
import { SearchForm } from 'src/app/model/searchForm';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-filter-page',
  templateUrl: './filter-page.component.html',
  styleUrls: ['./filter-page.component.css']
})
export class FilterPageComponent implements OnInit{
  @Input() title = 'Kết quả tìm kiếm';

  page: Page<any> = new Page<any>();

  sort: string = 'updatedAt,desc'

  lat?: number;
  lng?: number;
  radius?: number;

  notFound = false;

  pageNumber = 1;

  loading = false;

  posts: Post[] = [];

  searchForm: SearchForm = new SearchForm();

  constructor(private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      
}

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.pageNumber  = params['page'];
      if (parseInt(String(this.pageNumber), 10) !== 0) {
        // @ts-ignore
        this.searchForm = params;
        this.lat = parseFloat(String(this.searchForm.xCoordinate));
        this.lng = parseFloat(String(this.searchForm.yCoordinate));
        this.radius = parseFloat(String(this.searchForm.radius));
        this.filterPost();
      } else {
        this.notFound = true;
      }
    });
  }

  filterPost() {
    this.postService.searchPost(this.searchForm, this.pageNumber - 1, this.sort).subscribe({
      next: data => {
        this.page = data
        this.posts = data.content;
      },
      error: err => {
        console.log(err);
      }
    }
    );
  }
  
  getPage(page: number) {
    this.router.navigate(['/filter'], {queryParams: {...this.searchForm, page}, skipLocationChange: false});
  }
}
