import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor( private authservice: AuthService,
               private router: Router) { }

  ngOnInit() {
    
  }

  isLoggedIn() {
    return this.authservice.isLoggedIn()
  }

  logout() {
    this.authservice.logout()
    this.router.navigate(['']);
  }
}
