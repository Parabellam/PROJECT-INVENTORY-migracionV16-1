import { Accesorio } from './Accesorio';

export class Asignacion {
  /** --------------- variables a utilizar ----------- */
  id_asignacion!: number;
  fecha_entrega?: string;
  sede?: string;
  mostrar?: string;
  mostrar_cliente?: string;
  descripcion?: string;
  codigo_e_a?: string;
  tipo?: string;
  equipo?: {
    id_equipo: any;
    marca: string;
    codigo_equipo: string;
    estado: string;
  };
  funcionario?: {
    id_funcionario: number;
    nombre: string;
    documento: string;
  };
  alquilado?: {
    id: number;
    codigo_equipo: string;
    estado: string;
  };

  accesorios: Accesorio[];

  /**---------contructor -------- */

  constructor() {
    this.id_asignacion = 0;
    this.fecha_entrega = '';
    this.mostrar = 'No';
    this.mostrar_cliente = '';
    this.descripcion = '';
    this.codigo_e_a='';
    this.tipo=null;
    this.equipo = {
      id_equipo: null,
      marca: '',
      codigo_equipo: '',
      estado: '',
    };
    this.funcionario = {
      id_funcionario: 0,
      nombre: '',
      documento: '',
    };
  }
}
