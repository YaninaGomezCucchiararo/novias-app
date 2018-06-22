import { Injectable } from '@angular/core';
import { Product } from '../models/product'
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  url: string = "https://fierce-reaches-16715.herokuapp.com/api";

  constructor(
    private http: HttpClient
  ) { }

  getProducts(){
    return this.http.get(`${this.url}/products`)
  }

  getProduct(id) {

    return this.http.get(`${this.url}/products/${id}`)
  }
}  
