import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',   
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm!: FormGroup;
  hidePassword: boolean = true;

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router) {

    }

ngOnInit(): void {
  this.signupForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: [null, [Validators.required]]
  });
}

togglePasswordVisibility(){
  this.hidePassword = !this.hidePassword;
}

onSubmit(): void {
  const password = this.signupForm.get('password')?.value;
  const confirmPassword = this.signupForm.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    this.snackBar.open('Password do not math.', 'Close', { duration: 5000, panelClass: "error-snackbar"});
    return;
  }

  this.authService.register(this.signupForm.value).subscribe({
    next: (response) => { // Esto se ejecuta si la petición al backend fue exitosa (código 200, 201, etc.)
      console.log('Registro exitoso:', response); // ¡Mira esto en la consola del navegador (F12)!
      this.snackBar.open('¡Registro exitoso!', 'Cerrar', { duration: 5000 });
      this.router.navigateByUrl("/login");
    },
    error: (error) => { // Esto se ejecuta si hubo un error (problema de red, o el backend devuelve 4xx, 5xx)
      console.error('Error durante el registro:', error); // ¡Esto es CLAVE! Verás los detalles aquí.

      let mensajeError = 'Error al registrar, por favor intente de nuevo.';
      // Intentamos obtener un mensaje más específico del error que viene del backend
      if (error.error && typeof error.error === 'string') {
        mensajeError = error.error; // Si el backend envía el error como un string
      } else if (error.error && error.error.message) {
        mensajeError = error.error.message; // Si el backend envía un objeto con una propiedad 'message'
      } else if (error.message) {
        mensajeError = error.message; // Mensaje genérico del navegador o HTTP
      }

      this.snackBar.open(mensajeError, 'Cerrar', { duration: 5000, panelClass: "error-snackbar" });
    },
    complete: () => { // Esto se ejecuta cuando la operación (exitosa o con error) ha terminado. Es opcional.
      console.log('Operación de registro finalizada.');
    }
  });

}

}
