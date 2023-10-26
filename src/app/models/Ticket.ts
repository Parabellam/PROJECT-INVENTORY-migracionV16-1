export class Ticket {
  idTicket!: number;
  numeroTicket?: number;
  usuario?: string;
  correo?: string;
  problema?: string;
  departamento?: string;
  fechaIngreso?: string;
  prioridad?: string;
  duracionMinutos?: string;
  enviadoVia?: string;
  asunto?: string;
  asignadoA?: string;
  respuesta?: string;
  estadoFinal?: string;
  fechaCierre?: string;
  fechaActualizacion?: string;

  constructor() {}
}
