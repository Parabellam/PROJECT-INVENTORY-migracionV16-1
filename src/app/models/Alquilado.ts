export class Alquilado {
  id!: number;
  codigo_equipo?: string;
  fecha?: string;
  descripcion?: string;
  precio?: string;
  mostrar?: string;
  estado?: string;
  mostrar_cliente?: string;
  rutaArchivo?: string;

  /**
   *
   */
  constructor() {
    this.id = this.id;
    this.estado = 'Disponible';
    this.mostrar = 'No';
  }
}
