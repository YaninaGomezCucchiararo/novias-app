import { Component, OnInit } from '@angular/core';


import { Product } from '../../models/product';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';



@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {

  userProducts: Product[] = [];
  public serverBaseUrl = '';

  constructor(private authService: AuthService,
    private router: Router) {

    this.loadProducts()
  }

  loadProducts() {
    this.authService.retrieveUserProducts()
      .subscribe((products: any) => {
        this.userProducts = products.data
      })
  }


  ngOnInit() {
    this.serverBaseUrl = environment.serverBaseUrl;
  }

  removeProduct(id, index) {
    this.authService.removeProduct(id)
      .subscribe(res => {
        this.loadProducts()
      },
        console.error)
  }
}
