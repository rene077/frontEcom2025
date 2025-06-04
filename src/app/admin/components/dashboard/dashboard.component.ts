import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,         //formulario para la busqueda
    private snackBar: MatSnackBar
  ){}

  ngOnInit(){
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]          //para valdar la palabra a buscar (no este vacio)
    })
  }

  getAllProducts(){
    this.products = [];
    this.adminService.getAllProducts().subscribe(res=>{
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    })
  }

  submitForm(){          //parte de la busqueda, quien solicita la busqueda 
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.adminService.getAllProductsByName(title).subscribe(res=>{
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  deleteProduct(productId:any){
    this.adminService.deleteProduct(productId).subscribe(res=>{
      if (res === null || res === undefined) {           //si la resp es vacia entonces res es null o undefined
          this.snackBar.open('Product Deleted Sucessfully', 'Close', {
            duration: 5000
          });
          this.getAllProducts();    //si el borrado fue exitoso, hay que actualizar los products en html
      }else{
        this.snackBar.open(res.message, 'Close', {
          duration: 5000,
          panelClass: 'error-snackBar'
        });
      }
    })
  }

}
