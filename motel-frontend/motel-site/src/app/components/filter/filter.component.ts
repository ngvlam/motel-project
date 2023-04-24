import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchForm } from 'src/app/model/searchForm';
import { MapsSearchComponent } from '../maps-search/maps-search.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit{

  searchForm: SearchForm = new SearchForm();

  priceRange = undefined

  acreageRange = undefined


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe(params => {
    //  this.searchForm = params;
    // });
  }

  isModalActive = false;

  closeModal() {
    this.isModalActive = false;
  }

  openSearchByMaps() {
    this.isModalActive = true;
  }

  navigateToSearchPage() {
    this.setValuePrice()
    this.setValueAcreage()
    this.router.navigate(['/filter'], {queryParams: {...this.searchForm, page: 1}, skipLocationChange: false});
  }

  setValuePrice() {
    switch(this.priceRange!) {
      case "1": {
        this.searchForm.maxPrice=1000000;
        break;
      }
      case "2": {
        this.searchForm.minPrice=1000000;
        this.searchForm.maxPrice=3000000;
        break;  
      }
      case "3": {
        this.searchForm.minPrice=3000000;
        this.searchForm.maxPrice=5000000;
        break;
      }
      case "4": {
        this.searchForm.minPrice=5000000;
        this.searchForm.maxPrice=10000000;
        break;
      }
      case "5": {
        this.searchForm.minPrice=10000000;
      }
    }
  }

  setValueAcreage(){
    switch(this.priceRange!) {
      case "1": {
        this.searchForm.maxAcreage=20;
        break;
      }
      case "2": {
        this.searchForm.minAcreage=20;
        this.searchForm.maxAcreage=30;
        break;  
      }
      case "3": {
        this.searchForm.minAcreage=30;
        this.searchForm.maxAcreage=50;
        break;
      }
      case "4": {
        this.searchForm.minAcreage=50;
        this.searchForm.maxAcreage=70;
        break;
      }
      case "5": {
        this.searchForm.minAcreage=70;
      }
    }
  }
}
