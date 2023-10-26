import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RecuperarService } from 'src/app/services/recuperar.service';

@Component({
  selector: 'app-ingreso-token',
  templateUrl: './ingreso-token.component.html',
  styleUrls: ['./ingreso-token.component.css'],
})
export class IngresoTokenComponent {
  token: string;
  newPassword: string;
  confirmar: string;
  confirmado: number = 0;
  validacionToken: number = 0;
  intentos: number = 0;
  email: string;

  constructor(
    private recuperarService: RecuperarService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  confirmando() {
    if (this.newPassword == this.confirmar) {
      this.confirmado = 1;
    } else {
      this.confirmado = 0;
    }
  }

  validarToken() {
    if (this.intentos < 3) {
      this.intentos = this.intentos + 1;
      this.recuperarService.validateResetToken(this.token).subscribe(
        (response: any) => {
          if (response.valid) {
            this.validacionToken = 1;
          } else {
            this.validacionToken = 0;
          }
        },
        (error) => {
          this.validacionToken = 0;
        }
      );
    } else {
      this.email = localStorage.getItem('email');
      this.recuperarService.intentosSuperados(this.email).subscribe();
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Los intentos han sido superados.',
        showConfirmButton: false,
        timer: 6500,
      });
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.confirmado == 1) {
      this.recuperarService
        .resetPassword(this.token, this.newPassword)
        .subscribe(() => {});
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'La contraseña se ha restablecido con éxito.',
        showConfirmButton: false,
        timer: 3500,
      });
      this.router.navigate(['/login']);
    } else {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Las contraseñas no coinciden.',
        showConfirmButton: false,
        timer: 4500,
      });
    }
  }
}
