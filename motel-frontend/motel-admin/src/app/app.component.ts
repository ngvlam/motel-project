import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  layoutComponent: any;

constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.activatedRoute),
    map(route => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    filter(route => route.outlet === 'primary'),
    mergeMap(route => route.data),
    map(data => data['layout'] || MainLayoutComponent) // use MainLayoutComponent as default layout
  ).subscribe(layout => this.layoutComponent = layout);
}
}
