import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthServicesService } from 'src/app/services/auth-services.service';
import { IngresarService } from 'src/app/services/ingresar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css'],
})
export class IngresoComponent implements OnInit {
  email: string;
  password: string;
  id: any;
  show: boolean = false; //MostrarContraseña

  isActive: any = '0';

  constructor(
    private userService: IngresarService,
    private title: Title,
    private router: Router,
    private authService: AuthServicesService
  ) {
    title.setTitle('Login');
    localStorage.setItem('menu', this.isActive);
  }
  ngOnInit(): void {}

  //Mostrar Contraseña Login
  contrasena() {
    this.show = !this.show;
  }

  isPageReloaded = false;

  login() {
    this.authService.startSessionTimer();

    const user = { id: this.id, email: this.email, password: this.password };

    this.userService.setClientId(this.email);

    this.userService.login(user).subscribe({
      next: (data) => {
        this.userService.setSessionToken(data.token);
        this.userService.setToken(data.token);
        this.router.navigate(['/ingreso-cliente']);
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario o Contraseña Inválida',
        });
      },
    });
  }

  recover() {
    this.router.navigate(['/recuperar/solicitar']);
  }
}
