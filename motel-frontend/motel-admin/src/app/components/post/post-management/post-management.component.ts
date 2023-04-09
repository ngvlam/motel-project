import { Component } from '@angular/core';


@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  styleUrls: ['./post-management.component.css']
})
export class PostManagementComponent {

  openTab(event: any, tabName: string) {
    var i, tabContent, tabButton;
    tabContent = Array.from( document.getElementsByClassName("tab-content") as HTMLCollectionOf<HTMLElement>);
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }
    tabButton = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButton.length; i++) {
      tabButton[i].className = tabButton[i].className.replace(" active", "");
    }
    document.getElementById(tabName)?.style.setProperty('display', 'block');
    event.currentTarget.className += " active";
  }
}
