import { AsignacionesComponent } from './components/ASIGNACION/asignaciones/asignaciones.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

//components
import { EquipoComponent } from './components/EQUIPOS/equipo/equipo.component';
import { CrearParametrosComponent } from './components/TABLA-PARAMETROS/crear-parametros/crear-parametros.component';
import { ParametrosComponent } from './components/TABLA-PARAMETROS/parametros/parametros.component';
import { FilterPipe } from './pipes/filter.pipe';
import { EditarParametrosComponent } from './components/TABLA-PARAMETROS/editar-parametros/editar-parametros.component';
import { EquipoPipe } from './pipes/equipo.pipe';
import { FuncionarioComponent } from './components/FUNCIONARIOS/funcionario/funcionario.component';
import { AccesorioComponent } from './components/ACCESORIOS/accesorio/accesorio.component';
import { RegistrarAccesorioComponent } from './components/ACCESORIOS/registrar-accesorio/registrar-accesorio.component';
import { FuncionarioPipe } from './pipes/funcionario.pipe';
import { RegistrarFuncionarioComponent } from './components/FUNCIONARIOS/registrar-funcionario/registrar-funcionario.component';
import { EditarFuncionarioComponent } from './components/FUNCIONARIOS/editar-funcionario/editar-funcionario.component';
import { AccesorioPipe } from './pipes/accesorio.pipe';
import { EditarAccesorioComponent } from './components/ACCESORIOS/editar-accesorio/editar-accesorio.component';
import { RegistrarAsignacionComponent } from './components/ASIGNACION/registrar-asignacion/registrar-asignacion.component';
import { EditarAsignacionComponent } from './components/ASIGNACION/editar-asignacion/editar-asignacion.component';
import { AsignacionPipe } from './pipes/asignacion.pipe';
import { RegistrarEquipoComponent } from './components/EQUIPOS/registrar-equipo/registrar-equipo.component';
import { EditarEquipoComponent } from './components/EQUIPOS/editar-equipo/editar-equipo.component';
import { IngresoComponent } from './components/USERS/ingreso/ingreso.component';
import { VerDetalleComponent } from './components/EQUIPOS/ver-detalle/ver-detalle.component';
import { OnlyLettersDirective } from './directives/only-letters.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { SeparateThousandsDirective } from './directives/separate-thousands.directive';
import { UsuariosComponent } from './components/USERS/usuarios/usuarios.component';
import { RegistrarUsuariosComponent } from './components/USERS/registrar-usuarios/registrar-usuarios.component';
import { EditarUsuarioComponent } from './components/USERS/editar-usuario/editar-usuario.component';
import { UsiariosPipe } from './pipes/usuarios.pipe';
import { FormatNumberDirective } from './directives/format-number.directive';
import { InputFormatNumberDirective } from './directives/input-format-number.directive';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ParametrosPipe } from './pipes/parametros.pipe';
import { HistorialPipe } from './pipes/historial.pipe';
import { MueblesComponent } from './components/INMUEBLES/muebles/muebles.component';
import { RegistrarMueblesComponent } from './components/INMUEBLES/registrar-muebles/registrar-muebles.component';
import { EditarMueblesComponent } from './components/INMUEBLES/editar-muebles/editar-muebles.component';
import { VerDetallesMueblesComponent } from './components/INMUEBLES/ver-detalles-muebles/ver-detalles-muebles.component';
import { MueblesPipe } from './pipes/muebles.pipe';
import { HabilitarAccesoriosComponent } from './components/ACCESORIOS/habilitar-accesorios/habilitar-accesorios.component';
import { HabilitarEquiposComponent } from './components/EQUIPOS/habilitar-equipos/habilitar-equipos.component';
import { HabilitarFuncionariosComponent } from './components/FUNCIONARIOS/habilitar-funcionarios/habilitar-funcionarios.component';
import { HabilitarMueblesComponent } from './components/INMUEBLES/habilitar-muebles/habilitar-muebles.component';
import { FormHabilitarAccesoriosComponent } from './components/ACCESORIOS/form-habilitar-accesorios/form-habilitar-accesorios.component';
import { FormHabilitarEquiposComponent } from './components/EQUIPOS/form-habilitar-equipos/form-habilitar-equipos.component';
import { FormHabilitarFuncionariosComponent } from './components/FUNCIONARIOS/form-habilitar-funcionarios/form-habilitar-funcionarios.component';
import { FormHabilitarMueblesComponent } from './components/INMUEBLES/form-habilitar-muebles/form-habilitar-muebles.component';
import { HabilitarAsignacionesComponent } from './components/ASIGNACION/habilitar-asignaciones/habilitar-asignaciones.component';
import { FormHabilitarAsignacionesComponent } from './components/ASIGNACION/form-habilitar-asignaciones/form-habilitar-asignaciones.component';
import { BitacoraComponent } from './components/BITACORAS/bitacora/bitacora.component';
import { VerBitacoraComponent } from './components/BITACORAS/ver-bitacora/ver-bitacora.component';
import { BitacoraPipe } from './pipes/bitacora.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SearchableSelectDirective } from './directives/search.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { RegistrarBitacoraComponent } from './components/BITACORAS/registrar-bitacora/registrar-bitacora.component';
import { CodEquipoPipe } from './pipes/cod-equipo.pipe';
import { DistinctPipe } from './pipes/DistinctPipe.pipe';
import { FiltrarMostradosPipe } from './pipes/filtrar-mostrados.pipe';
import { FiltrarOcultosPipe } from './pipes/filtrar-ocultos.pipe';
import { CodEquipo2Pipe } from './pipes/cod-equipo-2.pipe';
import { AlquiladoComponent } from './components/ALQUILADOS/alquilado/alquilado.component';
import { AlquiladoPipe } from './pipes/alquilado.pipe';
import { EditarAlquiladoComponent } from './components/ALQUILADOS/editar-alquilado/editar-alquilado.component';
import { FormHabilitarAlquiladoComponent } from './components/ALQUILADOS/form-habilitar-alquilado/form-habilitar-alquilado.component';
import { HabilitarAlquiladoComponent } from './components/ALQUILADOS/habilitar-alquilado/habilitar-alquilado.component';
import { RegistrarAlquiladoComponent } from './components/ALQUILADOS/registrar-alquilado/registrar-alquilado.component';
import { RegistrarAsignacionAlquiladoComponent } from './components/ASIGNACION/registrar-asignacion-alquilado/registrar-asignacion-alquilado.component';
import { ExportFechasComponent } from './components/BITACORAS/export-fechas/export-fechas.component';
import { IngresoClienteComponent } from './components/USERS/ingreso-cliente/ingreso-cliente.component';
import { RegistrarClienteComponent } from './components/CLIENTES/registrar-cliente/registrar-cliente.component';
import { EditarClienteComponent } from './components/CLIENTES/editar-cliente/editar-cliente.component';
import { ClientesComponent } from './components/CLIENTES/clientes/clientes.component';
import { ClientePipe } from './pipes/cliente.pipe';
import { FiltrarMostradosBitacoraPipe } from './pipes/filtrar-mostrados-bitacora.pipe';
import { RegistrarLicenciaComponent } from './components/LICENCIAS/registrar-licencia/registrar-licencia.component';
import { EditarLicenciaComponent } from './components/LICENCIAS/editar-licencia/editar-licencia.component';
import { LicenciasComponent } from './components/LICENCIAS/licencias/licencias.component';
import { LicenciaPipe } from './pipes/licencia.pipe';
import { HabilitarClientesComponent } from './components/CLIENTES/habilitar-clientes/habilitar-clientes.component';
import { FormHabilitarClientesComponent } from './components/CLIENTES/form-habilitar-clientes/form-habilitar-clientes.component';
import { VerAsignacionComponent } from './components/ASIGNACION/ver-asignacion/ver-asignacion.component';
import { SedeComponent } from './components/SEDES/sede/sede.component';
import { EditarSedeComponent } from './components/SEDES/editar-sede/editar-sede.component';
import { RegistrarSedeComponent } from './components/SEDES/registrar-sede/registrar-sede.component';
import { HabilitarSedeComponent } from './components/SEDES/habilitar-sede/habilitar-sede.component';
import { FormHabilitarSedeComponent } from './components/SEDES/form-habilitar-sede/form-habilitar-sede.component';
import { SedePipe } from './pipes/sede.pipe';
import { VerLicenciaComponent } from './components/LICENCIAS/ver-licencia/ver-licencia.component';
import { TicketComponent } from './components/TICKETS/ticket/ticket.component';
import { TicketPipe } from './pipes/ticket.pipe';
import { VerTicketComponent } from './components/TICKETS/ver-ticket/ver-ticket.component';
import { RecuperarPasswordComponent } from './components/RECUPERAR/recuperar-password/recuperar-password.component';
import { IngresoTokenComponent } from './components/RECUPERAR/ingreso-token/ingreso-token.component';
import { InicioDashboardComponent } from './components/DASHBOARD/inicio-dashboard/inicio-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { TicketsDashboardComponent } from './components/TICKETS/tickets-dashboard/tickets-dashboard.component';
import { TicketsParametrosComponent } from './components/TICKETS/tickets-parametros/tickets-parametros.component';
import { EditarTicketsParametrosComponent } from './components/TICKETS/editar-tickets-parametros/editar-tickets-parametros.component';
import { Ticket2Pipe } from './pipes/ticket2.pipe';
import { MoleculasComponent } from './components/FUNCIONES/moleculas/moleculas.component';
import jsPDF from 'jspdf';
import { ClientesDashboardComponent } from './components/DASHBOARD/clientes-dashboard/clientes-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    EquipoComponent,
    CrearParametrosComponent,
    ParametrosComponent,
    EditarParametrosComponent,
    FilterPipe,
    EquipoPipe,
    FuncionarioPipe,
    FuncionarioComponent,
    AccesorioComponent,
    RegistrarAccesorioComponent,
    RegistrarFuncionarioComponent,
    EditarFuncionarioComponent,
    AccesorioPipe,
    EditarAccesorioComponent,
    AsignacionesComponent,
    RegistrarAsignacionComponent,
    EditarAsignacionComponent,
    AsignacionPipe,
    RegistrarEquipoComponent,
    EditarEquipoComponent,
    IngresoComponent,
    VerDetalleComponent,
    OnlyLettersDirective,
    OnlyNumbersDirective,
    SeparateThousandsDirective,
    UsuariosComponent,
    RegistrarUsuariosComponent,
    EditarUsuarioComponent,
    UsiariosPipe,
    FormatNumberDirective,
    InputFormatNumberDirective,
    ParametrosPipe,
    HistorialPipe,
    MueblesComponent,
    RegistrarMueblesComponent,
    EditarMueblesComponent,
    VerDetallesMueblesComponent,
    MueblesPipe,
    HabilitarAccesoriosComponent,
    HabilitarEquiposComponent,
    HabilitarFuncionariosComponent,
    HabilitarMueblesComponent,
    FormHabilitarAccesoriosComponent,
    FormHabilitarEquiposComponent,
    FormHabilitarFuncionariosComponent,
    FormHabilitarMueblesComponent,
    HabilitarAsignacionesComponent,
    FormHabilitarAsignacionesComponent,
    BitacoraComponent,
    VerBitacoraComponent,
    BitacoraPipe,
    TruncatePipe,
    SearchableSelectDirective,
    RegistrarBitacoraComponent,
    CodEquipoPipe,
    DistinctPipe,
    FiltrarMostradosPipe,
    FiltrarOcultosPipe,
    CodEquipo2Pipe,
    AlquiladoComponent,
    AlquiladoPipe,
    EditarAlquiladoComponent,
    FormHabilitarAlquiladoComponent,
    HabilitarAlquiladoComponent,
    RegistrarAlquiladoComponent,
    RegistrarAsignacionAlquiladoComponent,
    ExportFechasComponent,
    IngresoClienteComponent,
    RegistrarClienteComponent,
    EditarClienteComponent,
    ClientesComponent,
    ClientePipe,
    FiltrarMostradosBitacoraPipe,
    RegistrarLicenciaComponent,
    EditarLicenciaComponent,
    LicenciasComponent,
    LicenciaPipe,
    HabilitarClientesComponent,
    FormHabilitarClientesComponent,
    VerAsignacionComponent,
    SedeComponent,
    EditarSedeComponent,
    RegistrarSedeComponent,
    HabilitarSedeComponent,
    FormHabilitarSedeComponent,
    SedePipe,
    VerLicenciaComponent,
    TicketComponent,
    TicketPipe,
    VerTicketComponent,
    RecuperarPasswordComponent,
    IngresoTokenComponent,
    InicioDashboardComponent,
    TicketsDashboardComponent,
    TicketsParametrosComponent,
    EditarTicketsParametrosComponent,
    Ticket2Pipe,
    MoleculasComponent,
    ClientesDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgSelectModule,
    NgChartsModule,
    ReactiveFormsModule
  ],
  providers: [
    Ticket2Pipe,
    TicketPipe,
    {
      provide: JWT_OPTIONS,
      useFactory: jwtOptionsFactory,
    },
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem('token');
    },
  };
}
