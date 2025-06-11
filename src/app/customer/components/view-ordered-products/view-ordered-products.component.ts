import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-view-ordered-products',
  templateUrl: './view-ordered-products.component.html',
  styleUrls: ['./view-ordered-products.component.scss']
})
export class ViewOrderedProductsComponent {

  orderId: any = this.activatedroute.snapshot.params['orderId'];
  orderedProductDetailsList = [];
  totalAmount:any;

  constructor(private activatedroute: ActivatedRoute,
    private customerService: CustomerService,
  ){}

  ngOnInit(){
    this.getOrderedProductsDetailsByOrderId();
    console.log(this.getOrderedProductsDetailsByOrderId)
  }


  getOrderedProductsDetailsByOrderId(){
    this.customerService.getOrderedProducts(this.orderId).subscribe(res =>{
      res.productDtoList.forEach(element => {
        element.proccesedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.orderedProductDetailsList.push(element);
      });
      this.totalAmount = res.orderAmount;
    })
  }


}
