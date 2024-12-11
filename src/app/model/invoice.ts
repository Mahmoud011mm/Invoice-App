import { InvoiceProducts } from "./invoiceProducts"

export interface Invoice{
    id:number,
    customerid:string,
    customername:string,
    deliveryaddress:string,
    invoicedate:Date,
    taxcode:string,
    taxtype:string,
    taxperc:number,
    total:number,
    tax:number,
    nettotal:number,
    products:InvoiceProducts[]
}