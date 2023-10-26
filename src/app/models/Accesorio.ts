export class Accesorio {
  id!: number;
  tipo?: string;
  factura?: string;
  fecha_factura?: string;
  precio?: string;
  orden?: string;
  estado?: string;
  observaciones?: string;
  mostrar?: string;
  mostrar_cliente?: string;
  rutaArchivo?: string;

  /**
   *
   */
  constructor() {
    this.estado='Disponible';
    this.mostrar='No'
  }
}
