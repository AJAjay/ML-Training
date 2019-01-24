import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  name: string;

  constructor(private route: Router) { }

  ngOnInit() {
    this.name = sessionStorage.getItem('first_name');
    // this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['login']);
  }
  open() {
    var sidebar = document.getElementById('sideMenu');
    sidebar.style.marginLeft = '0px';
    sidebar.classList.remove('hide');
  }
  close() {
    var sidebar = document.getElementById('sideMenu');
    sidebar.classList.toggle('hide');
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
