import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Element } from '@angular/compiler';
import { PlaceOrderComponent } from '../place-order/place-order.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  cartItems: any[] = [];
  order: any;

  couponForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.couponForm = this.fb.group({
      code: [null, [Validators.required]]
    })
    this.getCart();
  }

  applyCoupon(){
    this.customerService.applyCoupon(this.couponForm.get(['code'])!.value).subscribe(res =>{
      this.snackBar.open("Coupon Applied Successfully", "Close", {
        duration: 5000
      })
      this.getCart()
    }), error =>{
      this.snackBar.open(error.error, "Close", {
        duration: 5000
      });
    }
  }

  getCart(){
    this.cartItems = [];
    this.customerService.getCartByUserId().subscribe(res =>{
      this.order = res;
      res.cartItems.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
        this.cartItems.push(element);
      })
    })
  }

  increaseProductQuantity(productId:any){
    this.customerService.increaseProductQuantity(productId).subscribe(res =>{
      this.snackBar.open('Product quantity increased.', 'Close', { duration: 5000 });
      this.getCart();
    })
  }

  decreaseProductQuantity(productId:any){
    this.customerService.decreaseProductQuantity(productId).subscribe(res =>{
      this.snackBar.open('Product quantity decreased.', 'Close', { duration: 5000 });
      this.getCart();
    })
  }


  placeOrder(){
    this.dialog.open(PlaceOrderComponent);
  }

}
