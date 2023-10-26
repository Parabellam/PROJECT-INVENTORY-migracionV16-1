import { Cliente } from "./Cliente";

export class Usuario {
  id!: number;
  nombre?: string;
  email?: string;
  password?: string;
  rol?: string;
  cargo?:string

  clientes: Cliente[];

  asignaciones?: string;
  alquilados?: string;
  muebles?: string;
  equipos?: string;
  funcionarios?: string;
  licencias?: string;
  perifericos?: string;
  bitacora?: string;
  g_clientes?: string;
  g_parametros?: string;
  g_usuarios?: string;


  h_alquilados?: string;
  h_clientes?: string;
  h_equipos?: string;
  h_funcionarios?: string;
  h_muebles?: string;
  h_perifericos?: string;

  tickets?: string;


}
