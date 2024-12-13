import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
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

@Component({
  selector: 'app-create',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule,
    MatSelectModule, MatIconModule,MatListModule
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
  ngOnInit(): void {
    this.loadCustomer();
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


  saveInvoice(){}

  backToInvoce() {
    this.router.navigateByUrl('/invoice')
  }

}
