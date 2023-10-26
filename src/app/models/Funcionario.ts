export class Funcionario {
  id_funcionario!: number;
  documento?: string;
  nombre?: string;
  email?: string;
  estado?: string;
  celular?: string;
  observaciones?: string;
  mostrar?: string;
  mostrar_cliente?: string;

  constructor(){
    this.estado='Activo';
    this.mostrar='No'
  }
}
