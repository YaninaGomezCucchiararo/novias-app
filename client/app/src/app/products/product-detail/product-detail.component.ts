import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//Model:
import { Product } from './../../models/product'

//Service:
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html', 
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit {
  
  public product: Product[] = [];
  public alertMessage;

  public info: any = {
    name: "",
    surname:"",
    email:"",
    phone:""
  }

  constructor( 
    private activatedRoute: ActivatedRoute,
    private productService : ProductsService) 
    
  { 
    this.activatedRoute.params.subscribe( params => {
      
      const product = params['id'];
      this.productService.getProduct(product)
        .subscribe((product : any) => {
          this.product = product.data;

        })
    })
  }

  handlerSubmit() {
    if(this.info){
      this.alertMessage = 'Mensaje enviado al vendedor!';
    } 
  }

  ngOnInit() {
  }

}
