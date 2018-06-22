import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
	@Output()
	public onChange: EventEmitter<any> = new EventEmitter<any>();

	public size: string = '';
	public price: string = '';
	public color: string = '';

	private _filterData: any = {
		size: 0,
		minPrice: 0,
		maxPrice: Infinity,
		color: ''
	}

	constructor() { }

	ngOnInit() { }

	onSizeChange() {
		this._filterData.size = +this.size;
		this.onChange.emit(this._filterData);
	}

	onPriceChange() {
		let range = this.price.split('-');
		
		this._filterData.minPrice = +range[0];
		this._filterData.maxPrice = +range[1] || Infinity;

		this.onChange.emit(this._filterData);
	}

	onColorChange() {
		this._filterData.color = this.color;
		this.onChange.emit(this._filterData);
	}
}