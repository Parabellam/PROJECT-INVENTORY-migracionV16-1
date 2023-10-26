import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { Licencia } from 'src/app/models/Licencia';
import { LicenciaService } from 'src/app/services/licencia.service';
import * as CryptoJS from 'crypto-js';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-licencias',
  templateUrl: './licencias.component.html',
  styleUrls: ['./licencias.component.css'],
})
export class LicenciasComponent {
  /*instanciar la clase licencia como un array para acceder a todos sus datos
  desde un html con el ngFor
  */
  filterPost = '';
  licencias: Licencia[] = [];
  licenciasEquipos: any[] = [];
  public page: number;
  length: any;

  clienteSeleccionado: string;

  //item per page
  ipp: number;
  selectedIpp: number = 10;
  ippdd: string[] = ['10', '25', '50', '100'];

  //PDF Firma
  nombre: string = '';
  cargo: string = '';

  private readonly _permissions = {
    permi6lic: '',
  };

  //constructor de la clase y sus atributos a utilizar
  constructor(
    private licenciaService: LicenciaService,
    private titulo: Title,
    private http: HttpClient
  ) {
    titulo.setTitle('Licencias');

    const permi6lic = localStorage.getItem('rM3bOFjzeorM3bOFjzeo');
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA'; // Generamos la llave para desencriptar
    const permi6licX = CryptoJS.AES.decrypt(permi6lic, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    if (permi6lic) {
      this._permissions.permi6lic = permi6licX;
    }

    const cargoX = localStorage.getItem('IWqIXXXWUsWUsIqIWUsXXXzWUx');
    this.cargo = CryptoJS.AES.decrypt(cargoX, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );

    const nombreX = localStorage.getItem('IWqIXXXWUsWUqqqsIqIWUsXXXzWUx');
    this.nombre = CryptoJS.AES.decrypt(nombreX, sharedSecret).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
  }

  /*inicializador de la pagina, significa que, cada que cargue la pagina
  se va a cargar el metodo listarLicencia()
  */
  ngOnInit() {
    const clienteSeleccionado = localStorage.getItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6'
    );
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    AOS.init();
    this.listarLicencia();

    this.listarLicenciasEquipos();
  }

  openNewTab(url: string) {
    window.open(url, '_blank');
  }

  get permissions() {
    return this._permissions;
  }

  /*metodo que lista todos los licencias de la base de datos conectados
  por medio de los servicios
  */
  listarLicencia(): void {
    this.licenciaService
      .listarLicencia2('No', this.clienteSeleccionado)
      .subscribe(
        (data) => {
          this.licencias = data.reverse();
        },
        (err) => {}
      );
  }

  // Event Click Tamaño Paginación
  ippclick(ipp: any) {
    this.selectedIpp = ipp;
    this.page = 1;
  }

  resetPage() {
    this.page = 1;
  }

  /** filter data of files what need in the table */
  filtrarDatos(): any[] {
    return this.licencias.map((licencias) => {
      return {
        ID: licencias.id,
        Nombre: licencias.nombre,
        Versión: licencias.version,
        Fecha: licencias.fecha,
        'No. Factura': licencias.factura,
        'Orden de Compra': licencias.orden_compra,
        Fabricante: licencias.fabricante,
        Serial: licencias.serial,
        Estado: licencias.estado,
        Observaciones: licencias.observaciones,
      };
    });
  }

  filtrarDatos2(): any[] {
    return this.licenciasEquipos.map((licenciasEquipos) => {
      let codigoInventario =
        this.clienteSeleccionado === 'Nexos'
          ? '03-' + licenciasEquipos.codigo_equipo
          : licenciasEquipos.codigo_equipo;
      return {
        Nombre: { t: 's', v: licenciasEquipos.nombre },
        Versión: { t: 's', v: licenciasEquipos.version },
        Fabricante: { t: 's', v: licenciasEquipos.fabricante },
        'Código Inventario': { t: 's', v: codigoInventario },
        'Funcionario Asignado': {
          t: 's',
          v: licenciasEquipos.nombre_funcionario || 'Sin Asignación',
        },
        Tipo: { t: 's', v: licenciasEquipos.tipo },
      };
    });
  }

  exportExcel() {
    const filterData = this.filtrarDatos(); // Hoja de Excel 1 Licencias en general
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filterData); // Sale Data

      const workbook = {
        Sheets: { Licencias: worksheet },
        SheetNames: ['Licencias'],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Tabla Licencias');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none');
    a.href = url;
    a.download = fileName + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  filtrarDatosInforme(): any[] {
    return this.licencias
      .filter(
        (licencia) =>
          licencia.estado === 'Disponible' || licencia.estado === 'Asignado'
      )
      .reduce((acumulador: any[], licencia: any) => {
        const index = acumulador.findIndex(
          (l) =>
            l.nombre === licencia.nombre &&
            l.estado === licencia.estado &&
            l.version === licencia.version &&
            l.factura === licencia.factura &&
            l.tipo === licencia.tipo
        );
        if (index !== -1) {
          acumulador[index].cantidad++;
          if (licencia.estado == 'Asignado') {
            acumulador[index].cantidad_asignados++;
          }
        } else {
          acumulador.push({
            nombre: licencia.nombre,
            estado: licencia.estado,
            version: licencia.version,
            cantidad: 1,
            cantidad_asignados: licencia.estado == 'Asignado' ? 1 : 0, // Inicializa a 0 o 1 dependiendo del estado
            factura: licencia.factura,
            tipo: licencia.tipo,
          });
        }
        return acumulador;
      }, [])
      .sort((a, b) => {
        if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
          return -1;
        }
        if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
          return 1;
        }
        return 0;
      })
      .map((licencia) => {
        return {
          Nombre: licencia.nombre,
          Estado: licencia.estado,
          Versión: licencia.version,
          Cantidad: licencia.cantidad,
          Asignadas: licencia.cantidad_asignados,
          'No. Factura': licencia.factura,
          Tipo: licencia.tipo,
        };
      });
  }

  exportExcelInforme() {
    const filterData = this.filtrarDatosInforme();
    const filterData2 = this.filtrarDatos2(); // Hoja de Excel 2 Licencias Asignadas
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filterData); // Sale Data
      const worksheet2 = xlsx.utils.json_to_sheet(filterData2);
      const workbook = {
        Sheets: { 'Cantidad Licencias': worksheet, Asignadas: worksheet2 },
        SheetNames: ['Cantidad Licencias', 'Asignadas'],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Informe Licencias');
    });
  }

  listarLicenciasEquipos() {
    this.licenciaService.listarLicenciaEquipo().subscribe((data: any) => {
      this.licenciasEquipos = data.filter((f: any) => {
        return f.mostrar_cliente === this.clienteSeleccionado;
      });
    });
  }

  exportarPDF() {
    this.http
      .get('/assets/images/PlantillaCartaLaboral.png', { responseType: 'blob' })
      .subscribe((res) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.crearPDF(reader.result);
        };
        reader.readAsDataURL(res);
      });
  }

  crearPDF(imgData: string | ArrayBuffer | null) {
    // Primera tabla
    const tableColumn1 = [
      'NOMBRE',
      'ESTADO',
      'VERSIÓN',
      'CANTIDAD',
      'ASIGNADAS',
      'NO. FACTURA',
      'TIPO',
    ];
    const tableRows1: any[] = [];

    const data1 = this.filtrarDatosInforme();

    data1.forEach((item) => {
      const licencia = [
        item.Nombre,
        item.Estado,
        item.Versión,
        item.Cantidad,
        item.Asignadas,
        item['No. Factura'],
        item.Tipo,
      ];
      tableRows1.push(licencia);
    });

    // Segunda tabla
    const tableColumn2 = [
      'NOMBRE',
      'VERSIÓN',
      'FABRICANTE',
      'CÓDIGO INVENTARIO',
      'FUNCIONARIO ASIGNADO',
      'TIPO',
    ];
    const tableRows2: any[] = [];

    const data2 = this.filtrarDatos2();

    data2.forEach((item) => {
      const licencia = [
        item.Nombre.v,
        item.Versión.v,
        item.Fabricante.v,
        item['Código Inventario'].v,
        item['Funcionario Asignado'].v,
        item.Tipo.v,
      ];
      tableRows2.push(licencia);
    });

    const doc = new jsPDF.default();

    doc.addImage(
      imgData as string,
      'PNG',
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    );

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Cantidad Licencias', 15, 31);

    // Tabla 1
    // @ts-ignore
    doc.autoTable(tableColumn1, tableRows1, {
      startY: 33,
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 1,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      margin: { top: 30, bottom: 30 },
    });
    // @ts-ignore
    const table1Height = doc.autoTable.previous.finalY || 0;
    const title2Y = table1Height + 30;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Asignadas', 15, title2Y - 15);

    // Tabla 2
    // @ts-ignore
    doc.autoTable(tableColumn2, tableRows2, {
      startY: title2Y - 12,
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 1,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      margin: { top: 30, bottom: 30 },
    });

    // Calculate the height of Table 2
    // @ts-ignore

    const table2Height = doc.lastAutoTable.finalY || 0;

    // Set the position of the text below Table 2
    const textY = table2Height + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('', 20, textY);
    doc.setFont('helvetica', 'normal');
    doc.text(this.nombre.toString(), 20, textY + 10);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('', 20, textY + 20);
    doc.setFont('helvetica', 'normal');
    doc.text(this.cargo.toString(), 20, textY + 16);

    doc.save('Informe de Licenciamiento.pdf');
  }
}
