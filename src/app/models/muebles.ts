export class Muebles {
  id!: number;
  codigo_inmueble?: string;
  estado?: string;
  factura?: string;
  fecha_factura?: Date;
  observacion?: string;
  precio?: string;
  orden?: string;
  mostrar?: string;
  mostrar_cliente?: string;
  rutaArchivo?: string;
  parametros?: {
    id: number;
  };


  constructor() {
    this.codigo_inmueble = '';
    this.estado = 'Disponible';
    this.factura = '';
    this.fecha_factura = new Date();
    this.observacion = '';
    this.precio = '';
    this.orden = '';
    this.mostrar = 'No';
    this.parametros = {
      id: 0,
    };
  }
}
