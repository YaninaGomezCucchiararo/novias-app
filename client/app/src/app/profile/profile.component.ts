import { Component, OnInit } from '@angular/core';

import { User } from '../models/user.model';

import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

 public alertMessage;

 public dataUser: any = {
    username:"",
    location:"",
    email:"",
    password:"",
    newEmail:"",
    newPassword:""
    }


  constructor( private authService: AuthService) {
    this.retrieveUser();
   }

  retrieveUser() {
    this.authService.retrieveUser()
      .subscribe((user:any )=> {
        this.dataUser.username = user.data.username;
        this.dataUser.location = user.data.location;
        this.dataUser.email = user.data.email;
        this.dataUser.password = "";
        this.dataUser.newEmail ="";
        this.dataUser.newPassword= "";
      });
  }

  handlerSubmit(){
    
    this.authService.updateUser(this.dataUser)
      .subscribe((user:any) => {
        
        if(user.status === 'OK'){
          this.alertMessage = 'Se han actualizado los datos!';
        } 
        this.retrieveUser();
      });
  }

  ngOnInit() {}

}
