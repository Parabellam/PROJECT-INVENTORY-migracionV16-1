export class UsuarioRequest {
  id!: number;
  nombre?: string;
  email?: string;
  password?: string;
  rol?: string;
  cargo?:string

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

  constructor(
    id: number,
    nombre: string,
    email: string,
    password: string,
    role: string,
    asignaciones: string,
    alquilados: string,
    muebles: string,
    equipos: string,
    funcionarios: string,
    licencias: string,
    perifericos: string,

    bitacora: string,

    g_clientes: string,
    g_parametros: string,
    g_usuarios: string,

    h_alquilados: string,
    h_clientes: string,
    h_equipos: string,
    h_funcionarios: string,
    h_muebles: string,
    h_perifericos: string,

    tickets: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = role;

    this.asignaciones = asignaciones;
    this.alquilados = alquilados;
    this.muebles = muebles;
    this.equipos = equipos;
    this.funcionarios = funcionarios;
    this.licencias = licencias;
    this.perifericos = perifericos;
    this.bitacora = bitacora;

    this.g_clientes = g_clientes;
    this.g_parametros = g_parametros;
    this.g_usuarios = g_usuarios;

    this.h_alquilados = h_alquilados;
    this.h_clientes = h_clientes;
    this.h_equipos = h_equipos;
    this.h_funcionarios = h_funcionarios;
    this.h_muebles = h_muebles;
    this.h_perifericos = h_perifericos;

    this.tickets = tickets;
  }
}
