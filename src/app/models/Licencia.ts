import { Equipo } from './Equipo';

export class Licencia {
  id!: number;
  nombre?: string;
  version?: string;
  fecha?: string;
  factura?: string;
  orden_compra?: string;
  fabricante?: string;
  serial?: string;
  mostrar?: string;
  mostrar_cliente?: string;
  estado?: string;
  observaciones?: string;
  tipo?: string;
  nombre_funcionario?: string;
  rutaArchivo?: string;
  equipos: Equipo[];
  /**
   *
   */
  constructor() {
    this.mostrar = 'No';
  }
}
