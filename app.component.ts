import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NavigationStart } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showHead: boolean;
  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/participantWiseResult' || event['url'] == '/create/newSurvey' || event['url'] == '/create/importSurvey' || event['url'] == '/viewSurvey' || event['url'] == '/chart' || event['url'] == '/viewSurveyList' || event['url'] == '/viewResultList' || event['url'] == '/travelReport' || event['url'] == '/travelCommentsReport') {
          this.showHead = true;
        } else {
          this.showHead = false;
        }
      }
    });
  }

  backDropClick(e) {
    let sideNav = document.getElementById('sideMenu');
    if (sideNav)
      sideNav.style.marginLeft = '-280px';
  }
}
