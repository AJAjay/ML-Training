import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-dashBoard',
  templateUrl: './dashBoard.component.html',
  styleUrls: ['./dashBoard.component.css']
})
export class DashBoardComponent implements OnInit {
  name: string;
  @ViewChild('sidenav') sidenav: MatSidenav;


  close() {
    this.sidenav.close();
  }

  constructor(private route: Router, private userService: UserService, private dataService: DataServiceService) { }
  ngOnInit() {
    this.name = sessionStorage.getItem('first_name');
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  logout() {
    sessionStorage.clear();
    this.route.navigate(['login']);
  }
  toggle() {
    var sidebar = document.getElementById('sideMenu');
    sidebar.classList.toggle('hide');
    var iframe = document.getElementById('iframe');
    iframe.classList.toggle('expand');
  }

  openSubMenu(num) {
    var con = document.getElementById('dropdown-content-' + num);
    if (con.style.display == 'block') {
      con.style.display = 'none';
    } else {
      con.style.display = 'block';
    }
  }
}
