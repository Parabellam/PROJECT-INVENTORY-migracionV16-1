export class Bitacora {
  id!: number;
  actividad?: string;
  codigoEquipo?: string;
  fecha?: Date;
  usuarioCrea?: string;
  mostrar_cliente?: string;

  constructor() {
    this.actividad = '';
    this.fecha = new Date();
    this.codigoEquipo = '';
    this.usuarioCrea = '';
    this.mostrar_cliente = '';
  }
}
