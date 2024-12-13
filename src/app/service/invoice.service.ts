import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { Tax } from '../model/tax';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor( private http: HttpClient ) { }

  getAllCustomers() {
    return this.http.get<Customer[]>('http://localhost:3000/customer')
  }
  getCustomer(customerid: string) {
    return this.http.get<Customer>('http://localhost:3000/customer/'+ customerid)
  }
  getAllTaxes() {
    return this.http.get<Tax[]>('http://localhost:3000/tax')
  }
  getTax(taxcode: string) {
    return this.http.get<Tax>('http://localhost:3000/tax/'+ taxcode)
  }
  getAllProducts() {
    return this.http.get<Product[]>('http://localhost:3000/product')
  }
  getProduct(productcode: string) {
    return this.http.get<Product>('http://localhost:3000/product/'+ productcode)
  }
}
