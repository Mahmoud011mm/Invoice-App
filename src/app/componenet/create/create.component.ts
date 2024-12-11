import { Component, Inject } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  title = "Create Invoice"
  invoiceForm: any;

  // private builder = Inject(FormBuilder);
  constructor( private builder: FormBuilder ){
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


  saveInvoice(){}

}
