import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Service:
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

 public messageError;

  params = {
    email: '',
    password: ''
  }

  constructor( private authService: AuthService,
               private router: Router ) { }

  handlerSubmit() {
    
    this.authService.login( this.params)
      .subscribe( (data: any) => {
        this.router.navigate(['home']);
       
        this.authService.setUserData(data.data);
      },
      error => { this.messageError = error.error.error });
  }

  ngOnInit() {
  }

}
