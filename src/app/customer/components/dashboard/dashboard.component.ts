import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/admin/service/admin.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
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
    this.customerService.getAllProducts().subscribe(res=>{
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    })
  }

  submitForm(){          //parte de la busqueda, quien solicita la busqueda 
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.customerService.getAllProductsByName(title).subscribe(res=>{
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  addToCart(id:any) { 
    this.customerService.addToCart(id).subscribe({
      next: (res) => { // Esto se ejecuta si la petición es exitosa (código 2xx)
        // Puedes verificar el mensaje del backend si lo envías, o simplemente mostrar un mensaje genérico
        this.snackBar.open("Producto añadido/actualizado en el carrito exitosamente!", "Cerrar", { duration: 5000, panelClass: ['success-snackbar'] });
        console.log("Respuesta del backend:", res); // Para depuración
      },
      error: (err) => { // Esto se ejecuta si la petición falla (código 4xx, 5xx)
        if (err.status === 409) {
          this.snackBar.open("El producto ya está en el carrito. Cantidad actualizada.", "Cerrar", { duration: 5000, panelClass: ['warning-snackbar'] });
        } else if (err.status === 404) {
          this.snackBar.open(err.error || "Usuario o producto no encontrado.", "Cerrar", { duration: 5000, panelClass: ['error-snackbar'] });
        } else {
          this.snackBar.open("Error al añadir producto al carrito.", "Cerrar", { duration: 5000, panelClass: ['error-snackbar'] });
          console.error("Error al añadir al carrito:", err); // Para depuración
        }
      }
    });
  }
  

}
