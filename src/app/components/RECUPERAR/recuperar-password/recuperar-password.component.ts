import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RecuperarService } from 'src/app/services/recuperar.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent {
  email: string;

  constructor(
    private recuperarService: RecuperarService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    localStorage.setItem('email', this.email);
    this.recuperarService.forgotPassword(this.email).subscribe(
      () => {
        this.router.navigate(['/recuperar/ingreso-token']);
        Swal.fire({
          position: 'top',
          icon: 'success',
          title:
            'Se ha enviado un código al correo ingresado para restablecer tu contraseña.',
          showConfirmButton: false,
          timer: 7000,
        });
      },
      (error) => {
        let message = 'Verifica la información ingresada.';
        if (error.error && error.error.message) {
          message = error.error.message;
        }
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Error',
          text: message,
        });
      }
    );
  }
}
