import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvoiceService } from '../../service/invoice.service';
import { Invoice } from '../../model/invoice';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [ MatCardModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatSortModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit, OnDestroy{

  invoiceList:Invoice[]=[];
  subscription = new Subscription();
  displayedColumns:string[] = ['id', 'name', 'address', 'nettotal', 'action'];
  dataSource!:MatTableDataSource<Invoice>

  constructor( private service:InvoiceService, private router:Router, private toastr: ToastrService){}

  ngOnInit(): void {
    this.loadAllInvoice();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }


  loadAllInvoice(){
    let sub = this.service.getAllInvoice().subscribe( item => {
      this.invoiceList = item;
      this.dataSource = new MatTableDataSource(this.invoiceList);
    })
    this.subscription.add(sub);
  }

  addNewInvoice(){
    this.router.navigateByUrl('invoice/create');
  }

  editInvoice(invoiceNo: any) {
    this.router.navigateByUrl('invoice/edit/'+ invoiceNo)
  }

  removeInvoice(invoiceNo: any) {
    if (confirm('Do You Want To Dlete This Invoice')){
      this.service.removeInvoice(invoiceNo).subscribe( item => {
        this.toastr.success('Deleted Successfully')
        this.loadAllInvoice()
      })
    }
  }
  

}
