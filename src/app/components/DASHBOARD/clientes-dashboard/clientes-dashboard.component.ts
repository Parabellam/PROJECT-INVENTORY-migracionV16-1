import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import * as CryptoJS from 'crypto-js';

import { EquipoServiceService } from 'src/app/services/equipo-service.service';
import { AlquiladoService } from 'src/app/services/alquilado.service';

import { AsignacionService } from 'src/app/services/asignacion.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Asignacion } from 'src/app/models/Asignacion';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';

import * as moment from 'moment';

@Component({
  selector: 'app-clientes-dashboard',
  templateUrl: './clientes-dashboard.component.html',
  styleUrls: ['./clientes-dashboard.component.css'],
})
export class ClientesDashboardComponent {
  //other
  mostrar: string = 'No';
  teclado: number;
  base: number;
  diadema: number;
  mouse: number;
  alquiladosX: any; //Cantidad alquilados dona
  propiosX: any; //Cantidad propios dona
  userEmail: String;
  countAsignacion: number;
  countAsignacionPerifericos: number;
  countAsignacionEquipos: number;
  countAsignacionAlquilados: number;
  countAsignacionGlobal: number;
  countAsignacionPerifericosGlobal: number;
  countAsignacionEquiposGlobal: number;
  countAsignacionAlquiladosGlobal: number;

  //Propios dona
  p_disponibles: any;
  p_asignados: any;
  p_deBaja: any;

  //Alquilados dona
  a_disponibles: any;
  a_asignados: any;

  //Gráfica Dona
  donutChartLabels: string[];
  donutChartLabels2: string[];
  donutChartLabels3: string[];
  donutChartData1: ChartDataset[];
  donutChartData2: ChartDataset[];
  donutChartData3: ChartDataset[];
  donutChartType: ChartType;
  donutChartOptions: ChartOptions;
  percentages: any;

  //grafica  lineal
  barChartOptions: ChartOptions;
  barChartLabels: any[];
  barcharType: ChartType;
  barChartLegend: boolean;
  barChartData: any[];

  //grafica de barra
  barChartOptionsBar: ChartOptions;
  barChartLabelsBar: any[];
  barcharTypeBar: ChartType;
  barChartLegendBar: boolean;
  barChartDataBar: any[];
  barChartColorsBar: any[];

  //permisos
  clienteSeleccionado: string = '';

  //TICKETS
  ticketsTabla: Ticket[] = [];
  ticketsTabla2: Ticket[] = [];

  filterPost = '';
  filterPost2 = '';

  public page1!: number;
  public page2!: number;

  selectMes3: any = moment().format('YYYY-MM');

  private thresholds: {
    [key: string]: { green: number; yellow: number } | undefined;
    Alto: { green: number; yellow: number };
    Medio: { green: number; yellow: number };
    Bajo: { green: number; yellow: number };
    '0': { green: number; yellow: number };
  } = {
    Alto: { green: 1, yellow: 3 },
    Medio: { green: 2, yellow: 4 },
    Bajo: { green: 4, yellow: 6 },
    '0': { green: 4, yellow: 6 },
  };

  clienteSeleccionadoSubscribe: string;

  dispositivos: any[] = [];

  constructor(
    private titulo: Title,
    private equipoService: EquipoServiceService,
    private alquiladoService: AlquiladoService,
    private asignacionService: AsignacionService,
    private ticketService: TicketService,
    private decode: JwtHelperService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    titulo.setTitle('Dashboard');
    this.buildGraphicBar();
  }

  async ngOnInit() {
    this.getUserEmail();
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
    this.cantidadAsignacionesMes();
    this.listarPerifericos2();
    this.listarAsignacion();
    this.getDispositivos();
    Promise.all([this.listarTorta3(), this.listarTorta2(), this.listarTorta1()])
      .then(() => {
        this.tortasytortas();
      })
      .catch((err) => {
        console.log('Error en una de las funciones listarTorta:', err);
      });
    this.resumenGeneral();
    this.clienteSeleccionadoSubscribe = this.clienteSeleccionado.split(' ')[0];
    await this.getTicketsTable();
    await this.getTicketsTable2();

    AOS.init();

    // Ocultar elementos con id="pdf-data"
    const pdfDataElements = this.el.nativeElement.querySelectorAll('#pdf-data');
    pdfDataElements.forEach((element: Element) => {
      this.renderer.setStyle(element, 'display', 'none');
    });
  }

  getDispositivos() {
    this.equipoService
      .GetDispositivos(this.clienteSeleccionado)
      .subscribe((data: any) => {
        this.dispositivos = data;
        console.log(this.dispositivos);
      });
  }

  //obtener el usuario logueado
  getUserEmail() {
    const token = localStorage.getItem('token');
    const object = this.decode.decodeToken(token);
    this.userEmail = object.sub;
  }

  //contar la cantidad de asignaciones hechas durante el mes
  cantidadAsignacionesMes() {
    const fechaActual = new Date();
    this.asignacionService
      .listarAsignacion(this.mostrar, this.clienteSeleccionado)
      .subscribe((data: Asignacion[]) => {
        const asignacionesMes = data.filter((res: Asignacion) => {
          const fechaEntrega = new Date(res.fecha_entrega);
          return (
            fechaEntrega.getMonth() === fechaActual.getMonth() &&
            fechaEntrega.getFullYear() === fechaActual.getFullYear()
          );
        });

        const countEquipos = asignacionesMes.reduce(
          (count: number, asignacion: Asignacion) => {
            return count + (asignacion.equipo ? 1 : 0);
          },
          0
        );

        const countEquiposAlquilados = asignacionesMes.reduce(
          (count: number, asignacion: Asignacion) => {
            return count + (asignacion.alquilado ? 1 : 0);
          },
          0
        );

        const countPerifericos = asignacionesMes.reduce(
          (count: number, asignacion: Asignacion) => {
            return count + asignacion.accesorios.length;
          },
          0
        );

        this.countAsignacionAlquilados = countEquiposAlquilados;
        this.countAsignacionEquipos = countEquipos;
        this.countAsignacionPerifericos = countPerifericos;
        this.countAsignacion = asignacionesMes.length;
      });
  }

  resumenGeneral() {
    this.asignacionService
      .listarAsignacion(this.mostrar, this.clienteSeleccionado)
      .subscribe((data: Asignacion[]) => {
        const asignacion = data;

        const countEquipos = asignacion.reduce(
          (count: number, asignacion: Asignacion) => {
            return count + (asignacion.equipo ? 1 : 0);
          },
          0
        );

        const countEquiposAlquilados = asignacion.reduce(
          (count: number, asignacion: Asignacion) => {
            return count + (asignacion.alquilado ? 1 : 0);
          },
          0
        );

        const countPerifericos = asignacion.reduce(
          (count: number, asignacion: Asignacion) => {
            return count + asignacion.accesorios.length;
          },
          0
        );

        this.countAsignacionAlquiladosGlobal = countEquiposAlquilados;
        this.countAsignacionEquiposGlobal = countEquipos;
        this.countAsignacionPerifericosGlobal = countPerifericos;
        this.countAsignacionGlobal = asignacion.length;
      });
  }

  //construir las graficas de equipos
  tortasytortas() {
    // Configuración de la gráfica de dona
    this.donutChartLabels = ['Cantidad Alquilados', 'Cantidad Propios    '];
    this.donutChartLabels2 = [
      'Propios Disponibles',
      'Propios Asignados  ',
      'Propios De Baja      ',
    ];
    this.donutChartLabels3 = [
      'Alquilados Disponibles',
      'Alquilados Asignados  ',
    ];
    this.donutChartData1 = [
      {
        data: [this.alquiladosX, this.propiosX],
        backgroundColor: ['rgba(0, 28, 91, 0.8)', 'rgba(0, 204, 194, 0.8)'],
      },
    ];

    this.donutChartData2 = [
      {
        data: [this.p_disponibles, this.p_asignados, this.p_deBaja],
        backgroundColor: [
          'rgba(0, 204, 194, 0.8)',
          'rgba(0, 28, 91, 0.8)',
          'rgba(255, 127, 39, 0.7)',
        ],
      },
    ];

    this.donutChartData3 = [
      {
        data: [this.a_disponibles, this.a_asignados],
        backgroundColor: [
          'rgba(0, 204, 194, 0.8)',
          'rgba(0, 28, 91, 0.8)',
          'rgba(255, 127, 39, 0.7)',
        ],
      },
    ];

    this.donutChartType = 'doughnut';
    this.donutChartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || '';
              let dataset: any = context.dataset || [];
              let total = dataset.data.reduce(function (
                accumulator: any,
                currentValue: any
              ) {
                return accumulator + currentValue;
              },
              0);
              let currentValue = dataset.data[context.dataIndex];
              let percentage = Math.round((currentValue / total) * 100);

              if (label) {
                label += ': ';
              }
              label +=
                context.formattedValue +
                ' Unidades | ' +
                percentage.toFixed(1) +
                ' %';

              return label;
            },
          },
        },
      },
    };
  }

  //listar total equipos
  listarTorta1(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.alquiladoService
        .listarAlquilado('No', this.clienteSeleccionado)
        //Para alquilados se pasa doble filtro ya que por alguna razón el Backend no filtra bien únicamente en este
        .subscribe(
          (data) => {
            this.alquiladosX = data.filter((f: any) => {
              return (
                f.mostrar === 'No' &&
                f.mostrar_cliente === this.clienteSeleccionado
              );
            }).length;

            this.equipoService
              .listarEquipo('No', this.clienteSeleccionado)
              .subscribe(
                (data) => {
                  this.propiosX = data.length;
                  resolve(); // Resuelve la promesa cuando se complete la suscripción a listarEquipo
                },
                (err) => {
                  console.log(err);
                  reject(err);
                }
              );
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  //listar equipos propios
  listarTorta2(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.equipoService
        .listarEquipo('No', this.clienteSeleccionado)
        .subscribe((data) => {
          this.p_disponibles = data.filter((f: any) => {
            return f.estado === 'Disponible';
          }).length;
          this.p_asignados = data.filter((f: any) => {
            return f.estado === 'Asignado';
          }).length;

          // Llama a tortasytortas() dentro de la suscripción a listarEquipo
          this.equipoService
            .listarEquipo('Si', this.clienteSeleccionado)
            .subscribe((data) => {
              this.p_deBaja = data.length;
              resolve(); // Resuelve la promesa cuando se complete la suscripción a listarEquipo
            });
        });
    });
  }

  //listar equipos alquilados
  listarTorta3(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.alquiladoService
        .listarAlquilado('No', this.clienteSeleccionado)
        //Para alquilados se pasa doble filtro ya que por alguna razón el Backend no filtra bien únicamente en este
        .subscribe(
          (data) => {
            this.a_asignados = data.filter((f: any) => {
              return (
                f.estado === 'Asignado' &&
                f.mostrar === 'No' &&
                f.mostrar_cliente === this.clienteSeleccionado
              );
            }).length;
            this.a_disponibles = data.filter((f: any) => {
              return (
                f.estado === 'Disponible' &&
                f.mostrar === 'No' &&
                f.mostrar_cliente === this.clienteSeleccionado
              );
            }).length;
            resolve(); // Resuelve la promesa cuando se complete la suscripción a listarEquipo
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  //manejo del routing desde las graifcas
  onChartClick(event: any): void {
    if (event.active.length > 0) {
      const clickedElementIndex = event.active[0].index;
      switch (clickedElementIndex) {
        case 0:
          this.router.navigate(['/alquilados/ver']);
          break;
        case 1:
          this.router.navigate(['/equipos/ver']);
          break;
        default:
          break;
      }
    }
  }

  onChartClick2(event: any): void {
    if (event.active.length > 0) {
      const clickedElementIndex = event.active[0].index;
      switch (clickedElementIndex) {
        case 0:
          this.router.navigate(['/equipos/ver']);
          break;
        case 1:
          this.router.navigate(['/equipos/ver']);
          break;
        case 2:
          this.router.navigate(['/equipos/habilitar']);
          break;
        default:
          break;
      }
    }
  }

  onChartClick3(event: any): void {
    if (event.active.length > 0) {
      this.router.navigate(['/alquilados/ver']);
    }
  }

  onChartClickAsignaciones(event: any): void {
    if (event.active.length > 0) {
      this.router.navigate(['/asignaciones/ver']);
    }
  }
  onChartClickPerifericos(event: any): void {
    if (event.active.length > 0) {
      this.router.navigate(['/perifericos/ver']);
    }
  }

  //construir la grafica asignaciones
  buildGraphicLine(asignaciones: any[]) {
    // Crear un objeto Map para contar las asignaciones por mes
    const asignacionesPorMes = new Map<string, number>();
    const fechaActual = new Date();
    asignaciones.forEach((asignacion) => {
      const fechaEntrega = new Date(asignacion.fecha_entrega);
      if (
        asignacion.mostrar_cliente === this.clienteSeleccionado &&
        fechaEntrega.getFullYear() === fechaActual.getFullYear() &&
        fechaEntrega.getMonth() <= fechaActual.getMonth()
      ) {
        const mes = fechaEntrega.toLocaleString('en-US', { month: 'long' });
        if (asignacionesPorMes.has(mes)) {
          asignacionesPorMes.set(mes, asignacionesPorMes.get(mes) + 1);
        } else {
          asignacionesPorMes.set(mes, 1);
        }
      }
    });

    // Generar la gráfica con los datos procesados
    const asignacionesData: number[] = [];
    const asignacionesLabels: string[] = [];
    const mesActual = fechaActual.getMonth();
    const meses = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    for (let i = 0; i <= mesActual; i++) {
      const mes = meses[i];
      asignacionesLabels.push(mes);
      if (asignacionesPorMes.has(mes)) {
        asignacionesData.push(asignacionesPorMes.get(mes));
      } else {
        asignacionesData.push(0);
      }
    }

    this.barChartOptions = {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };
    this.barChartLabels = asignacionesLabels;
    this.barcharType = 'line';
    this.barChartLegend = true;
    this.barChartData = [
      {
        data: asignacionesData,
        label: 'Cantidad Asiganciones Por Mes',
        backgroundColor: 'rgba(0, 28, 91, 0.6)',
        borderColor: 'rgba(0, 28, 91, 0.8)',
        pointBackgroundColor: 'rgba(0, 28, 91, 0.8)',
        fill: true, // Añade esta línea para habilitar el sombreado
      },
    ];
  }

  listarAsignacion() {
    this.asignacionService
      .listarAsignacion(this.mostrar, this.clienteSeleccionado)
      .subscribe((asignacion) => {
        if (asignacion.length > 0) {
          this.buildGraphicLine(asignacion);
        } else {
        }
      });
  }

  //construir la grafica de perifericos
  buildGraphicBar() {
    this.barChartOptions = {
      responsive: true,
    };

    this.barChartLabelsBar = ['Teclados', 'Diademas', 'Bases', 'Mouse'];
    this.barcharTypeBar = 'bar';
    this.barChartLegendBar = true;
    this.barChartDataBar = [
      {
        data: [Math.floor(this.teclado), this.diadema, this.base, this.mouse],
        label: 'Perifericos Asignados',
        backgroundColor: 'rgba(0, 204, 194, 0.8)',
        borderColor: 'rgba(0, 204, 194, 0.8)',
        pointBackgroundColor: 'rgba(0, 118, 112, 0.8)',
        fill: true,
      },
    ];
  }

  listarPerifericos2() {
    const fechaActual = new Date();
    this.asignacionService
      .listarAsignacion(this.mostrar, this.clienteSeleccionado)
      .subscribe((data: Asignacion[]) => {
        const asignacionesMes = data.filter((res: Asignacion) => {
          const fechaEntrega = new Date(res.fecha_entrega);
          return (
            fechaEntrega.getMonth() === fechaActual.getMonth() &&
            fechaEntrega.getFullYear() === fechaActual.getFullYear()
          );
        });

        this.base = 0;
        this.mouse = 0;
        this.teclado = 0;
        this.diadema = 0;

        asignacionesMes.forEach((asignacion: Asignacion) => {
          asignacion.accesorios.forEach((accesorio: any) => {
            const tipo = accesorio.tipo;
            switch (tipo) {
              case 'Base':
                this.base += 1;
                break;
              case 'Mouse':
                this.mouse += 1;
                break;
              case 'Diadema':
                this.diadema += 1;
                break;
              case 'Teclado':
                this.teclado += 1;
                break;
              default:
                return null;
            }
            this.buildGraphicBar();
          });
        });
      });
  }

  //building pdf
  generatePDF() {
    var doc = new jsPDF('p', 'pt', 'letter', true);
    var margin = 10;
    var scale =
      (doc.internal.pageSize.width - margin * 2) / document.body.scrollWidth;

    var downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
      downloadButton.style.display = 'none'; // Ocultar el botón de descarga temporalmente
    }

    // Obtener elementos con la clase 'text-white'
    const elements = document.querySelectorAll('.text-white');
    const originalTextColors: string[] = [];

    // Guardar el color de texto original y cambiar temporalmente a 'text-dark'
    elements.forEach((element) => {
      originalTextColors.push(getComputedStyle(element).color);
      element.classList.remove('text-white');
      element.classList.add('text-dark');
    });

    // Mostrar los elementos ocultos antes de generar el PDF
    var pdfDataElements = document.querySelectorAll('#pdf-data');
    pdfDataElements.forEach(function (element) {
      (element as HTMLElement).style.display = 'block';
    });

    var divElements = document.querySelectorAll('div');

    // Guardar el color de fondo original de cada div
    let originalBackgroundColors: any[] = [];

    divElements.forEach(function (div) {
      originalBackgroundColors.push(div.style.background);
      div.style.background = 'white';
    });

    // Seleccionar divs con la clase "leftMenu"
    var leftMenuDivElements = document.querySelectorAll('.leftMenu');

    leftMenuDivElements.forEach(function (element) {
      // Realizar la conversión de tipos a HTMLElement
      var htmlElement = element as HTMLElement;
      htmlElement.style.background = '#001027';
    });

    doc.setFillColor('#ffffff');

    doc.html(document.body, {
      x: margin,
      y: margin,
      html2canvas: {
        scale: scale,
        backgroundColor: 'white',
        ignoreElements: function (element: any) {
          if (
            (element.tagName === 'I' &&
              element.classList.contains('fa-solid') &&
              (element.classList.contains('fa-square-poll-vertical') ||
                element.classList.contains('fa-laptop') ||
                element.classList.contains('fa-tablet-screen-button') ||
                element.classList.contains('fa-keyboard'))) ||
            (element.tagName === 'BUTTON' &&
              element.getAttribute('data-pdf-ignore') === 'true') ||
            element.style.display === 'none' || // Ignorar elementos con display: none
            element.parentElement.style.display === 'none' // Ignorar elementos con un padre que tenga display: none
          ) {
            return true;
          }
          return false;
        },
      },
      callback: function (doc: any) {
        var nextDivElement = document.querySelector(
          'div[style="display: none;"]'
        );
        if (nextDivElement) {
          nextDivElement.setAttribute('data-pdf-ignore', 'true'); // Add a data attribute to ignore the element during capture
        }

        // Restaurar el color de texto original
        elements.forEach((element, index) => {
          const htmlElement = element as HTMLElement; // Convertir a tipo HTMLElement
          htmlElement.classList.remove('text-dark');
          htmlElement.classList.add('text-white');
          htmlElement.style.color = originalTextColors[index];
        });

        var canvasElements = document.querySelectorAll('canvas');
        canvasElements.forEach(function (canvas) {
          canvas.style.backgroundColor = '#ffffff';
        });
        doc.save('fichero-pdf.pdf');
        if (downloadButton) {
          downloadButton.style.display = 'block'; // Restaurar la visualización del botón de descarga
        }

        // Restablecer el color de fondo original de cada div
        divElements.forEach(function (div, index) {
          div.style.background = originalBackgroundColors[index];
        });
        // Ocultar los elementos nuevamente después de generar el PDF
        pdfDataElements.forEach(function (element) {
          (element as HTMLElement).style.display = 'none';
        });
      },
    });
  }

  getDonutDataValue(index: number): number {
    // Utiliza una aserción de tipo para garantizar que el valor devuelto sea de tipo 'number'
    return this.donutChartData1[0].data[index] as number;
  }

  getDonutDataValue2(index: number): number {
    // Utiliza una aserción de tipo para garantizar que el valor devuelto sea de tipo 'number'
    return this.donutChartData2[0].data[index] as number;
  }

  getDonutDataValue3(index: number): number {
    // Utiliza una aserción de tipo para garantizar que el valor devuelto sea de tipo 'number'
    return this.donutChartData3[0].data[index] as number;
  }

  // MÉTODOS TICKETS -------------------------------------------------------------------------------
  getBackgroundColor(respuesta: string, daysOpen: number): string {
    const colors = [
      'rgba(69, 183, 94, 0.92)', // verde
      'rgba(234, 236, 82, 0.92)', //amarillo
      'rgba(225, 35, 35, 0.92)', // rojo
      'transparent',
    ];

    const currentThreshold = this.thresholds[respuesta];
    if (!currentThreshold) {
      return colors[3]; // transparent
    }

    if (daysOpen <= currentThreshold.green) {
      return colors[0]; // green
    } else if (daysOpen <= currentThreshold.yellow) {
      return colors[1]; // yellow
    } else {
      return colors[2]; // red
    }
  }

  calculateDaysOpen(fechaIngreso: string): number {
    const currentDate = new Date();
    const fechaIngresoDate = new Date(fechaIngreso);
    const differenceMs = currentDate.valueOf() - fechaIngresoDate.valueOf();
    const oneDay = 24 * 60 * 60 * 1000; // hours  minutes  seconds  milliseconds
    const daysOpen = Math.round(differenceMs / oneDay);
    return daysOpen;
  }

  calculateDaysOpen2(fechaIngreso: string, fechaCierre: string): number {
    const currentDate = new Date(fechaCierre);
    const fechaIngresoDate = new Date(fechaIngreso);
    const differenceMs = currentDate.valueOf() - fechaIngresoDate.valueOf();
    const oneDay = 24 * 60 * 60 * 1000; // hours  minutes  seconds  milliseconds
    const daysOpen = Math.round(differenceMs / oneDay);
    return daysOpen;
  }

  //Listar los tickets SOLO cerrados para la mini tabla
  getTicketsTable2(): Promise<void> {
    return new Promise((resolve) => {
      const startDate3 = moment(this.selectMes3, 'YYYY-MM').startOf('month');
      const endDate3 = moment(this.selectMes3, 'YYYY-MM').endOf('month');

      const fechaInicia3 = startDate3.format('YYYY-MM-DD');
      const fechaFin3 = endDate3.format('YYYY-MM-DD');

      this.ticketService
        .listarTicketXDepartamentoClosed(
          fechaFin3,
          fechaInicia3,
          this.clienteSeleccionadoSubscribe
        )
        .subscribe((data: any) => {
          this.ticketsTabla2 = data;
        });
      resolve();
    });
  }

  //capturar el mes seleccionado 3
  getMonth3(e: any) {
    this.selectMes3 = e;
  }

  getCurrentMonthYear3() {
    const currentDate3 = moment().format('YYYY-MM');
    return currentDate3;
  }

  //Listar los tickets SOLO abiertos para la mini tabla
  getTicketsTable(): Promise<void> {
    return new Promise((resolve) => {
      this.ticketService
        .listarTicketXDepartamentoOpen(this.clienteSeleccionadoSubscribe)
        .subscribe((data: any) => {
          this.ticketsTabla = data;
        });
      resolve();
    });
  }
}
