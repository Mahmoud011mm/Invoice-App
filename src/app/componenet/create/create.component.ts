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
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../service/invoice.service';
import { Customer } from '../../model/customer';
import { Product } from '../../model/product';
import { Tax } from '../../model/tax';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {ToastrModule, ToastrService} from "ngx-toastr"
import { Invoice } from '../../model/invoice';
import { InvoiceProducts } from '../../model/invoiceProducts';
@Component({
  selector: 'app-create',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule,
    MatSelectModule, MatIconModule,MatListModule, CommonModule, ToastrModule
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
  cusTaxType = "z";
  customTaxPerc = 0;
  isEdit = false;
  keyvalue = '';

  invoiceForm: any;
  http: any;
  

  // private builder = Inject(FormBuilder);
  constructor( private builder: FormBuilder, private router: Router, private service: InvoiceService,
    private toastr: ToastrService, private actroute:ActivatedRoute
   ){
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
    this.keyvalue = this.actroute.snapshot.paramMap.get('invoiceno') as string;
    if(this.keyvalue!=null) {
      this.isEdit = true;
      this.title = 'Edit Invoice';
      this.populatedEditDate(this.keyvalue)
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  populatedEditDate(invoiceNo: string) {
    this.service.getInvoice(invoiceNo).subscribe( item => {
      let editData = item;
      let processCount = 0;
      if(editData != null) {
        for(let i=0;i<editData.products.length; i++) {
          this.addNewProduct();
        }
        this.invoiceForm.setValue({
          invoiceno: editData.id.toString(),
          invoicedate: editData.invoicedate ? new Date() : new Date(editData.invoicedate),
          customerid: editData.customerid,
          customername: editData.customername,
          taxcode: editData.taxcode,
          address: editData.deliveryaddress,
          total: editData.total,
          tax: editData.tax,
          nettotal: editData.nettotal,
          products: editData.products
        })
        this.cusTaxType=editData.taxtype;
        this.customTaxPerc=editData.taxperc;
        this.summaryCalculation();
      }
    })
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
        this.addNewProduct();
        this.taxChange(_customer.taxcode)
      }
    })
    this.subscription.add(sub)
  }

  taxChange(taxcode: string){
    this.service.getTax(taxcode).subscribe( item => {
      let _tax= item;
      if (_tax!= null) {
        this.cusTaxType= _tax.type;
        this.customTaxPerc= _tax.perc;
        this.summaryCalculation();
      }
    })
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

    if(this.cusTaxType=="E"){
      if(this.customTaxPerc > 0){
        sumTax = (this.customTaxPerc/100) * sumTotal;
        sumNetTotal = sumTotal + sumTax;
      }
    } else if(this.cusTaxType=="I") {
      sumTax = sumTotal - (sumTotal * (100/(100 + this.customTaxPerc)));
      sumNetTotal = sumTotal;
    } else {
      sumTax = 0;
      sumNetTotal = sumTotal;
    }

    this.invoiceForm.get("total")?.setValue(sumTotal);
    this.invoiceForm.get("tax")?.setValue(sumTax);
    this.invoiceForm.get("netTotal")?.setValue(sumNetTotal);

    this.summaryTotal= sumTotal;
    this.summaryTax= sumTax;
    this.summaruNetTotal= sumNetTotal;

  }

  // Resolve func

  addNewProduct(){
    this.invoceProducts = this.invoiceForm.get('products')  as FormArray;
    //  let customerid = this.invoiceForm.customerid as string;
    //  if (this.isEdit) {
    //    this.invoceProducts.push(this.generateRow());
    //  } else {
    //    if (customerid != null && customerid != '') {
        this.invoceProducts.push(this.generateRow());
    //    } else {
    //      this.toastr.warning("Select customer then add products", "Please choose customer")
    //    }
    //  }
  }

  deleteProduct(index: number) {
    if(confirm("Do Yo Want To Delete?")) {
      this.invproducts().removeAt(index);
      this.summaryCalculation()
    }
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
  
  saveInvoice(){
    if(this.invoiceForm.valid) {
      let _invoice:Invoice= {
        id: 0,
        customerid: this.invoiceForm.value.customerid as string,
        customername: this.invoiceForm.value.customername as string,
        deliveryaddress: this.invoiceForm.value.address as string,
        invoicedate: this.invoiceForm.value.invoicedate as Date,
        taxcode: this.invoiceForm.value.taxcode as string,
        taxtype: this.cusTaxType,
        taxperc: this.customTaxPerc,
        total: this.invoiceForm.value.total as number,
        tax: this.invoiceForm.value.tax as number,
        nettotal: this.invoiceForm.value.nettotal as number,
        products: this.invoiceForm.getRawValue().products as InvoiceProducts[]
      }
      if(this.isEdit) {
        _invoice.id = parseInt(this.keyvalue);
        this.service.ubdateInvoice(_invoice).subscribe( item => {
          this.toastr.success("Update Successfully", "Success");
          this.backToInvoce()
        })
      }else {
        this.service.CreateInvoice(_invoice).subscribe( item => {
          this.toastr.success("Created Successfully", "Success");
          this.backToInvoce()
        })
      }
    }
  }

  backToInvoce() {
    this.router.navigateByUrl('/invoice')
  }

  
  
}
