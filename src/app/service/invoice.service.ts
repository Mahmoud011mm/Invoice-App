import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { Tax } from '../model/tax';
import { Product } from '../model/product';
import { Invoice } from '../model/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  createInvoice(_invoice: Invoice) {
    throw new Error('Method not implemented.');
  }

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

  // Invoce Related
  CreateInvoice(data: Invoice): Observable<any> {
    return this.http.get("http://localhost:3000/invoice")
  }
  ubdateInvoice(data: Invoice) {
    return this.http.put("http://localhost:3000/invoice/"+data.id, data)
  }
  getAllInvoice() {
    return this.http.get<Invoice[]>("http://localhost:3000/invoice")
  }
  getInvoice(invoiceno: string) {
    return this.http.get<Invoice>("http://localhost:3000/invoice/"+ invoiceno)
  }
  removeInvoice(invoceNo: string) {
    return this.http.delete("http://localhost:3000/invoice/"+ invoceNo)
  }
}
