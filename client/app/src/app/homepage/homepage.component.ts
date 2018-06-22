import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Product } from './../models/product'
import { Subscription, Observable } from 'rxjs';
import { ProductsService } from '../services/products.service';

@Component({
	selector: 'homepage',
	templateUrl: './homepage.component.html',
	styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
	public products: Product[] = [];
	public productsFiltered: Product[] = [];
	public loading: boolean = true;
	private productsSubscription: Subscription = null; 

	constructor(
		private productsService: ProductsService,
		private router: Router
	) { }

	ngOnInit() {
		this.productsSubscription = this.productsService.getProducts()
			.subscribe((data: any) => {
				this.products = data.data;
				this.productsFiltered = [...this.products];
				this.loading = false;
			})
	}

	onFilterChange(event: Event) {
		this.productsFiltered = this.filterProducts(event);
	}

	ngOnDestroy() {
		if (this.productsSubscription) {
			this.productsSubscription.unsubscribe();
		}
	}

	filterProducts(filterData: any): Product[] {
		let productsFiltered = this.products.filter((product: Product) => {
			let passPrice = (product.price >= filterData.minPrice) && (product.price <= filterData.maxPrice);
			let passSize = false;
			let passColor = false;

			if (filterData.size) {
				passSize = filterData.size === product.size;
			} else {
				passSize = true;
			}

			if (filterData.color) {
				passColor = filterData.color.toLowerCase() === product.color.toLowerCase();
			}else {
				passColor = true;
			}

			return passSize && passPrice && passColor;
		});
		
		return productsFiltered;
	}
}