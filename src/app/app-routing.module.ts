import { RegistrarAlquiladoComponent } from './components/ALQUILADOS/registrar-alquilado/registrar-alquilado.component';
import { HabilitarAlquiladoComponent } from './components/ALQUILADOS/habilitar-alquilado/habilitar-alquilado.component';
import { FormHabilitarAlquiladoComponent } from './components/ALQUILADOS/form-habilitar-alquilado/form-habilitar-alquilado.component';
import { EditarAlquiladoComponent } from './components/ALQUILADOS/editar-alquilado/editar-alquilado.component';
import { AlquiladoComponent } from './components/ALQUILADOS/alquilado/alquilado.component';
import { HabilitarAsignacionesComponent } from './components/ASIGNACION/habilitar-asignaciones/habilitar-asignaciones.component';
import { FormHabilitarAsignacionesComponent } from './components/ASIGNACION/form-habilitar-asignaciones/form-habilitar-asignaciones.component';
import { FormHabilitarMueblesComponent } from './components/INMUEBLES/form-habilitar-muebles/form-habilitar-muebles.component';
import { FormHabilitarFuncionariosComponent } from './components/FUNCIONARIOS/form-habilitar-funcionarios/form-habilitar-funcionarios.component';
import { FormHabilitarEquiposComponent } from './components/EQUIPOS/form-habilitar-equipos/form-habilitar-equipos.component';
import { FormHabilitarAccesoriosComponent } from './components/ACCESORIOS/form-habilitar-accesorios/form-habilitar-accesorios.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipoComponent } from './components/EQUIPOS/equipo/equipo.component';
import { ParametrosComponent } from './components/TABLA-PARAMETROS/parametros/parametros.component';

import { EditarParametrosComponent } from './components/TABLA-PARAMETROS/editar-parametros/editar-parametros.component';
import { CrearParametrosComponent } from './components/TABLA-PARAMETROS/crear-parametros/crear-parametros.component';

import { RegistrarEquipoComponent } from './components/EQUIPOS/registrar-equipo/registrar-equipo.component';
import { RegistrarFuncionarioComponent } from './components/FUNCIONARIOS/registrar-funcionario/registrar-funcionario.component';
import { AsignacionesComponent } from './components/ASIGNACION/asignaciones/asignaciones.component';
import { FuncionarioComponent } from './components/FUNCIONARIOS/funcionario/funcionario.component';
import { EditarFuncionarioComponent } from './components/FUNCIONARIOS/editar-funcionario/editar-funcionario.component';
import { RegistrarAccesorioComponent } from './components/ACCESORIOS/registrar-accesorio/registrar-accesorio.component';
import { AccesorioComponent } from './components/ACCESORIOS/accesorio/accesorio.component';
import { EditarAccesorioComponent } from './components/ACCESORIOS/editar-accesorio/editar-accesorio.component';
import { EditarAsignacionComponent } from './components/ASIGNACION/editar-asignacion/editar-asignacion.component';
import { RegistrarAsignacionComponent } from './components/ASIGNACION/registrar-asignacion/registrar-asignacion.component';
import { EditarEquipoComponent } from './components/EQUIPOS/editar-equipo/editar-equipo.component';
import { IngresoComponent } from './components/USERS/ingreso/ingreso.component';
import { VerDetalleComponent } from './components/EQUIPOS/ver-detalle/ver-detalle.component';
import { UsuariosComponent } from './components/USERS/usuarios/usuarios.component';
import { AuthGuard } from '../guard/AuthGuard';
import { RegistrarUsuariosComponent } from './components/USERS/registrar-usuarios/registrar-usuarios.component';
import { EditarUsuarioComponent } from './components/USERS/editar-usuario/editar-usuario.component';
import { MueblesComponent } from './components/INMUEBLES/muebles/muebles.component';
import { RegistrarMueblesComponent } from './components/INMUEBLES/registrar-muebles/registrar-muebles.component';
import { EditarMueblesComponent } from './components/INMUEBLES/editar-muebles/editar-muebles.component';
import { VerDetallesMueblesComponent } from './components/INMUEBLES/ver-detalles-muebles/ver-detalles-muebles.component';
import { HabilitarAccesoriosComponent } from './components/ACCESORIOS/habilitar-accesorios/habilitar-accesorios.component';
import { HabilitarEquiposComponent } from './components/EQUIPOS/habilitar-equipos/habilitar-equipos.component';
import { HabilitarFuncionariosComponent } from './components/FUNCIONARIOS/habilitar-funcionarios/habilitar-funcionarios.component';
import { HabilitarMueblesComponent } from './components/INMUEBLES/habilitar-muebles/habilitar-muebles.component';

import { BitacoraComponent } from './components/BITACORAS/bitacora/bitacora.component';
import { VerBitacoraComponent } from './components/BITACORAS/ver-bitacora/ver-bitacora.component';
import { RegistrarBitacoraComponent } from './components/BITACORAS/registrar-bitacora/registrar-bitacora.component';
import { RegistrarAsignacionAlquiladoComponent } from './components/ASIGNACION/registrar-asignacion-alquilado/registrar-asignacion-alquilado.component';
import { ExportFechasComponent } from './components/BITACORAS/export-fechas/export-fechas.component';
import { IngresoClienteComponent } from './components/USERS/ingreso-cliente/ingreso-cliente.component';
import { RegistrarClienteComponent } from './components/CLIENTES/registrar-cliente/registrar-cliente.component';
import { EditarClienteComponent } from './components/CLIENTES/editar-cliente/editar-cliente.component';
import { ClientesComponent } from './components/CLIENTES/clientes/clientes.component';
import { LicenciasComponent } from './components/LICENCIAS/licencias/licencias.component';
import { EditarLicenciaComponent } from './components/LICENCIAS/editar-licencia/editar-licencia.component';
import { RegistrarLicenciaComponent } from './components/LICENCIAS/registrar-licencia/registrar-licencia.component';
import { FormHabilitarClientesComponent } from './components/CLIENTES/form-habilitar-clientes/form-habilitar-clientes.component';
import { HabilitarClientesComponent } from './components/CLIENTES/habilitar-clientes/habilitar-clientes.component';
import { VerAsignacionComponent } from './components/ASIGNACION/ver-asignacion/ver-asignacion.component';
import { SedeComponent } from './components/SEDES/sede/sede.component';
import { EditarSedeComponent } from './components/SEDES/editar-sede/editar-sede.component';
import { FormHabilitarSedeComponent } from './components/SEDES/form-habilitar-sede/form-habilitar-sede.component';
import { HabilitarSedeComponent } from './components/SEDES/habilitar-sede/habilitar-sede.component';
import { RegistrarSedeComponent } from './components/SEDES/registrar-sede/registrar-sede.component';
import { VerLicenciaComponent } from './components/LICENCIAS/ver-licencia/ver-licencia.component';
import { TicketComponent } from './components/TICKETS/ticket/ticket.component';
import { RecuperarPasswordComponent } from './components/RECUPERAR/recuperar-password/recuperar-password.component';
import { IngresoTokenComponent } from './components/RECUPERAR/ingreso-token/ingreso-token.component';
import { VerTicketComponent } from './components/TICKETS/ver-ticket/ver-ticket.component';
import { InicioDashboardComponent } from './components/DASHBOARD/inicio-dashboard/inicio-dashboard.component';
import { TicketsDashboardComponent } from './components/TICKETS/tickets-dashboard/tickets-dashboard.component';
import { TicketsParametrosComponent } from './components/TICKETS/tickets-parametros/tickets-parametros.component';
import { EditarTicketsParametrosComponent } from './components/TICKETS/editar-tickets-parametros/editar-tickets-parametros.component';
import { ClientesDashboardComponent } from './components/DASHBOARD/clientes-dashboard/clientes-dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: IngresoComponent,
    pathMatch: 'full',
  },
  {
    path: 'ingreso-cliente',
    component: IngresoClienteComponent,
  },
  {
    path: '',
    component: InicioDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inicio-cliente',
    component: ClientesDashboardComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'funcionarios',
    children: [
      {
        path: 'ver',
        component: FuncionarioComponent,
      },
      {
        path: 'crear',
        component: RegistrarFuncionarioComponent,
      },
      {
        path: 'editar/:id',
        component: EditarFuncionarioComponent,
      },
      {
        path: 'habilitar',
        component: HabilitarFuncionariosComponent,
      },
      {
        path: 'habilitar/:id',
        component: FormHabilitarFuncionariosComponent,
      },
    ],
  },

  {
    path: 'equipos',
    children: [
      {
        path: 'ver',
        component: EquipoComponent,
      },
      {
        path: 'crear',
        component: RegistrarEquipoComponent,
      },
      {
        path: 'ver/:id',
        component: VerDetalleComponent,
      },
      {
        path: 'editar/:id',
        component: EditarEquipoComponent,
      },
      {
        path: 'habilitar',
        component: HabilitarEquiposComponent,
      },
      {
        path: 'habilitar/:id',
        component: FormHabilitarEquiposComponent,
      },
    ],
  },

  {
    path: 'parametros',
    children: [
      {
        path: 'ver',
        component: ParametrosComponent,
      },
      {
        path: 'editar/:id',
        component: EditarParametrosComponent,
      },
      {
        path: 'crear',
        component: CrearParametrosComponent,
      },
    ],
  },

  {
    path: 'asignaciones',
    children: [
      {
        path: 'ver',
        component: AsignacionesComponent,
      },
      {
        path: 'editar/:id',
        component: EditarAsignacionComponent,
      },
      {
        path: 'crear',
        component: RegistrarAsignacionComponent,
      },
      {
        path: 'ver/:id',
        component: VerAsignacionComponent,
      },
      {
        path: 'alquilado/crear',
        component: RegistrarAsignacionAlquiladoComponent,
      },
      {
        path: 'habilitar/:id',
        component: FormHabilitarAsignacionesComponent,
      },
      {
        path: 'habilitar',
        component: HabilitarAsignacionesComponent,
      },
    ],
  },

  {
    path: 'perifericos',
    children: [
      {
        path: 'ver',
        component: AccesorioComponent,
      },
      {
        path: 'editar/:id',
        component: EditarAccesorioComponent,
      },
      {
        path: 'crear',
        component: RegistrarAccesorioComponent,
      },
      {
        path: 'habilitar',
        component: HabilitarAccesoriosComponent,
      },
      {
        path: 'habilitar/:id',
        component: FormHabilitarAccesoriosComponent,
      },
    ],
  },

  {
    path: 'usuarios',
    children: [
      {
        path: 'crear',
        component: RegistrarUsuariosComponent,
        pathMatch: 'full',
      },
      {
        path: 'ver',
        component: UsuariosComponent,
      },
      {
        path: 'editar/:id',
        component: EditarUsuarioComponent,
      },
    ],
  },

  {
    path: 'muebles',
    children: [
      {
        path: 'ver',
        component: MueblesComponent,
      },
      {
        path: 'crear',
        component: RegistrarMueblesComponent,
      },
      {
        path: 'editar/:id',
        component: EditarMueblesComponent,
      },
      {
        path: 'ver/:id',
        component: VerDetallesMueblesComponent,
      },
      {
        path: 'habilitar',
        component: HabilitarMueblesComponent,
      },
      {
        path: 'habilitar/:id',
        component: FormHabilitarMueblesComponent,
      },
    ],
  },

  {
    path: 'bitacoras',
    children: [
      {
        path: 'ver',
        component: BitacoraComponent,
      },
      {
        path: 'ver/:id',
        component: VerBitacoraComponent,
      },

      {
        path: 'crear',
        component: RegistrarBitacoraComponent,
      },
      {
        path: 'export',
        component: ExportFechasComponent,
      },
    ],
  },

  {
    path: 'alquilados',
    children: [
      {
        path: 'ver',
        component: AlquiladoComponent,
      },
      {
        path: 'editar/:id',
        component: EditarAlquiladoComponent,
      },
      {
        path: 'crear',
        component: RegistrarAlquiladoComponent,
      },
      {
        path: 'habilitar/:id',
        component: FormHabilitarAlquiladoComponent,
      },
      {
        path: 'habilitar',
        component: HabilitarAlquiladoComponent,
      },
    ],
  },

  {
    path: 'clientes',
    children: [
      {
        path: 'crear',
        component: RegistrarClienteComponent,
      },
      {
        path: 'editar/:id',
        component: EditarClienteComponent,
      },
      {
        path: 'ver',
        component: ClientesComponent,
      },
      {
        path: 'habilitar',
        component: HabilitarClientesComponent,
      },
      {
        path: 'habilitar/:id',
        component: FormHabilitarClientesComponent,
      },
    ],
  },

  {
    path: 'licencias',
    children: [
      {
        path: 'ver',
        component: LicenciasComponent,
      },
      {
        path: 'editar/:id',
        component: EditarLicenciaComponent,
      },
      {
        path: 'crear',
        component: RegistrarLicenciaComponent,
      },
      {
        path: 'ver/:id',
        component: VerLicenciaComponent,
      },
    ],
  },

  {
    path: 'sedes',
    children: [
      {
        path: 'ver',
        component: SedeComponent,
      },
      {
        path: 'editar/:id',
        component: EditarSedeComponent,
      },
      {
        path: 'habilitar/:id',
        component: FormHabilitarSedeComponent,
      },
      {
        path: 'habilitar',
        component: HabilitarSedeComponent,
      },
      {
        path: 'crear',
        component: RegistrarSedeComponent,
      },
    ],
  },

  {
    path: 'tickets',
    children: [
      {
        path: 'ver',
        component: TicketComponent,
      },
      {
        path: 'ver/:id',
        component: VerTicketComponent,
      },
      {
        path: 'indicadores',
        component: TicketsDashboardComponent,
      },
      {
        path: 'parametros',
        component: TicketsParametrosComponent,
      },
      {
        path: 'editar/:id',
        component: EditarTicketsParametrosComponent,
      },
    ],
  },

  {
    path: 'recuperar',
    children: [
      {
        path: 'solicitar',
        component: RecuperarPasswordComponent,
      },
      {
        path: 'ingreso-token',
        component: IngresoTokenComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
