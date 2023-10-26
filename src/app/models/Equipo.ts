/* clase equipo contiene las mismas variables del backend, para poder interactuar
y compartir informacion*/

import { Licencia } from './Licencia';

export class Equipo {
  id_equipo!: number;
  codigo_equipo?: string;
  estado?: string;
  tiket?: number;
  marca?: string;
  modelo?: string;
  procesador?: string;
  os?: string; //sistema operativo
  ram?: string;
  almacenamiento?: string;
  seriall?: string;
  precio?: string;
  factura?: string;
  fecha_factura?: string;
  fecha_modificacion?: string;
  usuario_crea?: string;
  usuario_modifica?: string;
  orden?: string;
  observaciones?: string;
  mostrar?: string;
  mostrar_cliente?: string;
  rutaArchivo?: string;
  tipo?: string;
  parametros?: {
    id: number;
    valor: string;
    tipo_parametro: string;
  };
  licencias: Licencia[];

  constructor() {
    this.id_equipo = this.id_equipo;
    this.codigo_equipo = '';
    this.estado = 'Disponible';
    this.tiket = 0;
    this.marca = '';
    this.modelo = '';
    this.procesador = '';
    this.os = '';
    this.ram = '';
    this.almacenamiento = '';
    this.seriall = '';
    this.precio = '';
    this.factura = '';
    this.fecha_factura = '';
    this.orden = '';
    this.observaciones = '';
    this.mostrar = 'No';
    this.parametros = {
      id: 0,
      valor: '',
      tipo_parametro: '',
    };
  }
}
