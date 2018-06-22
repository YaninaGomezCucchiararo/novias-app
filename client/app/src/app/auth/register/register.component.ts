import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm} from '@angular/forms';
import { User } from './../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public messageError;
  
  user: User = {
    username: '',
    email: '',
    password: '',
    location: ''
  }

  constructor ( private authService: AuthService,
                private router: Router ) { }

   handlerSubmit() {

    this.authService.register( this.user )
      .subscribe( data => {
        this.router.navigate(['/login']);
      },
      error => { this.messageError = error.error.error });
    }
}
