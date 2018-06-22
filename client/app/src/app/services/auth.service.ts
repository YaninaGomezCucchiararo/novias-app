import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  users: User[] = [];

  userData: { id: string, token: string } = { id: localStorage.getItem('id'), token: localStorage.getItem('token') };


  // url: string = "http://localhost:5000/api/users";
  // urlAuth: string = "http://localhost:5000/api/auth";

  // url: string = "http://shielded-reef-60625.herokuapp.com/api/users";
  // urlAuth: string = "http://shielded-reef-60625.herokuapp.com/api/auth";

  url: string = "https://fierce-reaches-16715.herokuapp.com/api";
  urlAuth: string = "https://fierce-reaches-16715.herokuapp.com/api/auth";

  constructor(private http: HttpClient) {
  }

  headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  }

  //..............LOCAL STORAGE...........
  actualizarData() {
    localStorage.setItem("token", this.userData.token)

    localStorage.setItem("id", this.userData.id)
  }

  setUserData(data: any) {
    this.userData = data;
    this.actualizarData();
  }
  // //........................................



  register(user: User) {

    let body = JSON.stringify(user);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.url}/users`, user)
      .pipe(map(res => {
        
        return res
      }))

  }

  login(params) {
    let body = JSON.stringify(params);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.urlAuth, params)
      .pipe(map(res => {
          
          return res
        }))
  }

  isLoggedIn() {
    return this.userData.id && this.userData.token
  }

  logout() {
    this.setUserData({ id: '', token: '' })
  }

  updateUser(dataUser) {

    

    let body = JSON.stringify(dataUser);

    return this.http.patch(`${this.url}/users/${this.userData.id}`, dataUser, { headers: this.headers() })
      .pipe(map(res => {
        return res
      }))

  }

  retrieveUserProducts() {

    return this.http.get(`${this.url}/users/${this.userData.id}/products`, { headers: this.headers() })
      .pipe(map(res => {
        return res
      }))
  }


  addProduct(params) {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })

    let fd = new FormData();

    fd.append('image', params.image, params.image.name);
    fd.append('price', params.price);
    fd.append('size', params.size);
    fd.append('color', params.color);
    fd.append('description', params.description);

    return this.http.post(`${this.url}/users/${this.userData.id}/products`, fd, { headers: headers })
  }



  removeProduct(productId) {

    return this.http.delete(`${this.url}/users/${this.userData.id}/products/${productId}`, { headers: this.headers() })
      .pipe(map(res => {
        return res
      }))
  }


  
  retrieveUser() {

    return this.http.get(`${this.url}/users/${this.userData.id}`, { headers: this.headers() })
      .pipe(map(res => {
        return res
      }))
  }

}

