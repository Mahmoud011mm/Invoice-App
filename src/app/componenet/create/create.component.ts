import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { InvoiceService } from '../../service/invoice.service';
import { Customer } from '../../model/customer';
import { Product } from '../../model/product';
import { Tax } from '../../model/tax';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule,
    MatSelectModule, MatIconModule,MatListModule, CommonModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnDestroy, OnInit {
  title = "Create Invoice";
  customerList:Customer[]= [];
  productList:Product[]= [];
  taxList:Tax[]= [];
  subscription = new Subscription()
  invoceProducts!: FormArray<any>
  invoceProduct!: FormGroup<any>
  summaryTotal= 0;
  summaryTax= 0;
  summaruNetTotal= 0;

  invoiceForm: any;

  // private builder = Inject(FormBuilder);
  constructor( private builder: FormBuilder, private router: Router, private service: InvoiceService ){
    this.invoiceForm = this.builder.group({
      invoiceno: this.builder.control({ value: '', disabled: true }),
      invoicedate: this.builder.control(new Date(), Validators.required),
      customerid: this.builder.control('', Validators.required),
      customername: this.builder.control(''),
      taxcode: this.builder.control(''),
      address: this.builder.control(''),
      total: this.builder.control(0),
      tax: this.builder.control(0),
      nettotal: this.builder.control(0),
      products: this.builder.array([])
    })
  }

  invproducts() {
    return this.invoiceForm.get('products') as FormArray
  }

  ngOnInit(): void {
    this.loadCustomer();
    this.loadTax();
    this.loadProducts();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCustomer() {
    let sub1 =this.service.getAllCustomers().subscribe( item => {
      this.customerList = item
    })
    this.subscription.add(sub1)
  }


  loadTax() {
    let sub1 =this.service.getAllTaxes().subscribe( item => {
      this.taxList = item
    })
    this.subscription.add(sub1)
  }

  loadProducts() {
    let sub1 =this.service.getAllProducts().subscribe( item => {
      this.productList = item
    })
    this.subscription.add(sub1)
  }

  customerChange(customerid: string) {
    let sub = this.service.getCustomer(customerid).subscribe( item => {
      let _customer = item;
      if (_customer!= null){
        this.invoiceForm.controls.address.setValue(_customer.address);
        this.invoiceForm.controls.customername.setValue(_customer.name);
        this.invoiceForm.controls.taxcode.setValue(_customer.taxcode);
        this.addNewProduct()
      }
    })
    this.subscription.add(sub)
  }

  productChange(index: number)  {
    this.invoceProducts = this.invoiceForm.get('products') as FormArray;
    this.invoceProduct = this.invoceProducts.at(index) as FormGroup;
    let productsCode = this.invoceProduct.get("productId")!.value;
    let sub = this.service.getProduct(productsCode).subscribe( item => {
      let _product = item;
      if(_product != null){
        this.invoceProduct.get("name")?.setValue(_product.name);
        this.invoceProduct.get("price")?.setValue(_product.price);
        this.productCalculate(index);
      }
    })
    this.subscription.add(sub)
  }

  productCalculate(index: number) {
    this.invoceProducts = this.invoiceForm.get('products') as FormArray;
    this.invoceProduct = this.invoceProducts.at(index) as FormGroup;
    let qty = this.invoceProduct.get("qty")?.value;
    let price = this.invoceProduct.get("price")?.value;
    let total = price* qty;
    this.invoceProduct.get('total')?.setValue(total);
    this.summaryCalculation()
  }

  summaryCalculation() {
    let array = this.invoiceForm.getRawValue().products;
    let sumTotal = 0;
    let sumTax = 0;
    let sumNetTotal = 0;

    array.forEach((x: any) => {
      sumTotal= sumTotal + x.total
    });
    this.invoiceForm.get("total")?.setValue(sumTotal);
    this.invoiceForm.get("tax")?.setValue(sumTax);
    this.invoiceForm.get("netTotal")?.setValue(sumNetTotal);

    this.summaryTotal= sumTotal;
    this.summaryTax= sumTax;
    this.summaruNetTotal= sumNetTotal;

  }

  addNewProduct(){
    this.invoceProducts = this.invoiceForm.get('products')  as FormArray;
    this.invoceProducts.push(this.generateRow())
  }


  generateRow() {
    return this.builder.group({
      productId: this.builder.control('', Validators.required),
      name: this.builder.control(''),
      qty: this.builder.control(1),
      price: this.builder.control(0),
      total: this.builder.control({value: 0, disabled: true}),
    })
  }
  
  saveInvoice(){}

  backToInvoce() {
    this.router.navigateByUrl('/invoice')
  }

}
