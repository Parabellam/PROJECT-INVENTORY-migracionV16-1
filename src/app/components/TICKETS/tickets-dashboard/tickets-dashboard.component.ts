import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { ChartOptions, ChartType, ChartDataset, Chart } from 'chart.js';
import * as CryptoJS from 'crypto-js';

import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tickets-dashboard',
  templateUrl: './tickets-dashboard.component.html',
  styleUrls: ['./tickets-dashboard.component.css'],
})
export class TicketsDashboardComponent {
  //other
  ticket: any[];
  currentDateString: string;
  dateAgoString: string;
  dateAgoStringDonut: string;
  chart: Chart;
  chartAsunto: Chart;
  presentMes: any;
  tDepartament: any[] = [];
  selectDepartament: any = 'NEXOS';
  selectMes: any;
  selectMesAsunto: any;
  selectMes2: any;
  selectMes3: any;

  //Gráfica Dona
  donutChartLabels: string[];
  donutChartData1: ChartDataset[];
  donutChartType: ChartType;
  donutChartOptions: ChartOptions;
  percentages: any;
  t_abiertosX: any;
  t_cerradosX: any;
  fechaDona: string = '';

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
  ticketsTabla: Ticket[] = [];
  ticketsTabla2: Ticket[] = [];

  //permisos
  private readonly _permissions = {
    permi18tickets: '',
  };

  //Tabla
  filterPost = '';
  filterPost2 = '';
  tickets: Ticket[] = [];
  ticketsAsunto: Ticket[] = [];
  public page1!: number;
  public page2!: number;
  slaBajo: any;
  slaMedio: any;
  slaAlto: any;
  slaBajoN: number;
  slaMedioN: number;
  slaAltoN: number;
  // COLORES TABLA
  // COLORES TABLA
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

  constructor(
    private titulo: Title,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private ticketService: TicketService
  ) {
    titulo.setTitle('Indicadores');
    const permi18tickets = localStorage.getItem('IWqIWUsWUsIqIWUszWUx'); // Permiso encriptado
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA';
    const permi18ticketsX = CryptoJS.AES.decrypt(
      permi18tickets,
      sharedSecret
    ).toString(CryptoJS.enc.Utf8); // Permiso desencriptado
    if (permi18tickets) {
      this._permissions.permi18tickets = permi18ticketsX; // Se trae su respectivo código guardado en el localstorage y este luego se valida a que tiene acceso este código
    }
  }

  async ngOnInit() {
    const currentDate = moment();
    const oneMonthAgo = moment().startOf('month');
    const oneMonthAgoDonut = moment().subtract(1, 'months');
    this.currentDateString = currentDate.format('YYYY-MM-DD');
    this.dateAgoString = oneMonthAgo.format('YYYY-MM-DD');
    this.dateAgoStringDonut = oneMonthAgoDonut.format('YYYY-MM-DD');

    //cargar el mes actual en input mes
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.selectMes = `${year}-${month.toString().padStart(2, '0')}`;
    this.selectMesAsunto = `${year}-${month.toString().padStart(2, '0')}`;
    this.selectMes2 = `${year}-${month.toString().padStart(2, '0')}`;
    this.selectMes3 = `${year}-${month.toString().padStart(2, '0')}`;

    AOS.init();
    const permi18tickets = localStorage.getItem('IWqIWUsWUsIqIWUszWUx'); // Permiso encriptado
    const sharedSecret = 'BS5exry0olWCBKABS5exry0olWCBKABS5exry0olWCBKA';
    const permi18ticketsX = CryptoJS.AES.decrypt(
      permi18tickets,
      sharedSecret
    ).toString(CryptoJS.enc.Utf8); // Permiso desencriptado
    if (permi18tickets) {
      this._permissions.permi18tickets = permi18ticketsX; // Se trae su respectivo código guardado en el localstorage y este luego se valida a que tiene acceso este código
    }
    //llamar sla y pasar parámetros para definir colores en la tabla
    await this.sla();
    //llamar los metodos para obetener la data visual
    await this.getTickets();
    await this.listarTicket();
    await this.getTicketsByUser();
    await this.getTicketsTable();
    await this.getTicketsTable2();
    await this.getTDepartament();
    await this.getTicketsDonut();
    await this.getTicketsByAsunto();
    // Ocultar elementos con id="pdf-data"
    const pdfDataElements = this.el.nativeElement.querySelectorAll('.pdf-data');
    pdfDataElements.forEach((element: Element) => {
      this.renderer.setStyle(element, 'display', 'none');
    });
  }

  get permissions() {
    return this._permissions;
  }

  sla(): Promise<void> {
    return new Promise((resolve) => {
      this.ticketService.listarSla().subscribe((data: any) => {
        this.slaBajo = data[1];
        this.slaMedio = data[2];
        this.slaAlto = data[0];

        this.slaBajoN = this.slaBajo.tiempo / 24;
        this.slaMedioN = this.slaMedio.tiempo / 24;
        this.slaAltoN = this.slaAlto.tiempo / 24;

        this.thresholds = {
          Alto: { green: this.slaBajoN, yellow: this.slaBajoN + 2 },
          Medio: { green: this.slaMedioN, yellow: this.slaMedioN + 2 },
          Bajo: { green: this.slaBajoN, yellow: this.slaBajoN + 2 },
          '0': { green: this.slaBajoN, yellow: this.slaBajoN + 2 },
        };
      });
      resolve();
    });
  }

  //Listar los tickets SOLO abiertos para la mini tabla
  getTicketsTable(): Promise<void> {
    return new Promise((resolve) => {
      this.ticketService.listarAbiertos().subscribe((data: any) => {
        this.ticketsTabla = data;
      });
      resolve();
    });
  }

  //Listar los tickets SOLO cerrados para la mini tabla
  getTicketsTable2(): Promise<void> {
    return new Promise((resolve) => {
      const startDate3 = moment(this.selectMes3, 'YYYY-MM').startOf('month');
      const endDate3 = moment(this.selectMes3, 'YYYY-MM').endOf('month');

      const fechaInicia3 = startDate3.format('YYYY-MM-DD');
      const fechaFin3 = endDate3.format('YYYY-MM-DD');
      this.ticketService
        .listarCerrados(fechaFin3, fechaInicia3)
        .subscribe((data: any) => {
          this.ticketsTabla2 = data;
        });
      resolve();
    });
  }

  getTicketsDonut(): Promise<void> {
    return new Promise((resolve) => {
      const startDate2 = moment(this.selectMes2, 'YYYY-MM').startOf('month');
      const endDate2 = moment(this.selectMes2, 'YYYY-MM').endOf('month');

      const fechaInicia2 = startDate2.format('YYYY-MM-DD');
      const fechaFin2 = endDate2.format('YYYY-MM-DD');

      this.ticketService
        .listarTicket(fechaFin2, fechaInicia2)
        .subscribe((data: any) => {
          data.sort((a: any, b: any) => b.fechaIngreso - a.fechaIngreso);

          this.t_abiertosX = data.filter(
            (f: any) => f.estadoFinal !== 'Cerrado'
          ).length;
          this.t_cerradosX = data.filter(
            (f: any) => f.estadoFinal === 'Cerrado'
          ).length;

          this.tortasytortas();

          resolve();
        });
    });
  }

  //listar los tickets para la grafica, dependiendo del departamento seleccionado
  listarTicket(): Promise<void> {
    return new Promise((resolve) => {
      this.ticketService.readTicketByMonth().subscribe((tickets) => {
        if (tickets.length > 0) {
          this.ticket = tickets.filter(
            (ticket: any) => ticket.departamento === this.selectDepartament
          );
          this.buildGraphicLine(this.ticket); // Pasa this.ticket en lugar de ticket
        }
      });
      resolve();
    });
  }

  getTickets(): Promise<void> {
    return new Promise((resolve) => {
      this.ticketService
        .listarTicket(this.currentDateString, this.dateAgoString)
        .subscribe((data: any) => {
          this.tickets = data
            .sort(
              (a: any, b: any) =>
                parseInt(b.fechaIngreso) - parseInt(a.fechaIngreso)
            )
            .filter(
              (ticket: Ticket, index: number, arr: Ticket[]) =>
                arr.filter((t) => t.usuario === ticket.usuario).length >= 2
            )
            .reverse();

          this.createBarChart();
        });
      resolve();
    });
  }

  //generar la grafica de barras de usuarios
  createBarChart() {
    const usuarios = this.tickets.map((ticket) => ticket.usuario);

    const countUsuarios = usuarios.reduce(
      (acc: { [key: string]: number }, usuario) => {
        acc[usuario] = (acc[usuario] || 0) + 1;
        return acc;
      },
      {}
    );

    const labels = Object.keys(countUsuarios);
    const data = Object.values(countUsuarios);

    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Destruir el gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    const date = new Date();
    this.presentMes = date.toLocaleString('es-mx', { month: 'long' });
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de Tickets ',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  getTicketsByAsunto(): Promise<void> {
    return new Promise((resolve) => {
      const startDate = moment(this.selectMesAsunto, 'YYYY-MM').startOf(
        'month'
      );
      const endDate = moment(this.selectMesAsunto, 'YYYY-MM').endOf('month');

      const fechaInicia = startDate.format('YYYY-MM-DD');
      const fechaFin = endDate.format('YYYY-MM-DD');

      this.ticketService
        .listarTicket(fechaFin, fechaInicia)
        .subscribe((data: any) => {
          this.ticketsAsunto = data
            .sort(
              (a: any, b: any) =>
                parseInt(b.fechaIngreso) - parseInt(a.fechaIngreso)
            )
            .filter(
              (ticket: Ticket, index: number, arr: Ticket[]) =>
                arr.filter((t) => t.asunto === ticket.asunto).length >= 1
            )
            .reverse();

          this.graphicAsunto();
        });
      resolve();
    });
  }

  //generar la grafica de barras de gestion
  graphicAsunto() {
    const asuntos = this.ticketsAsunto.map((ticket) => ticket.asunto);

    const countAsuntos = asuntos.reduce(
      (acc: { [key: string]: number }, asunto) => {
        acc[asunto] = (acc[asunto] || 0) + 1;
        return acc;
      },
      {}
    );

    const labels = Object.keys(countAsuntos);
    const data = Object.values(countAsuntos);

    const canvas = document.getElementById(
      'barChartGestion'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Destruir el gráfico anterior si existe
    if (this.chartAsunto) {
      this.chartAsunto.destroy();
    }

    const date = new Date();
    this.presentMes = date.toLocaleString('es-mx', { month: 'long' });
    this.chartAsunto = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad Por Mes',
            data: data,
            backgroundColor: 'rgba(245, 113, 61, 0.7)',
            borderColor: 'rgba(245, 113, 61)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
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

    // Mostrar los elementos ocultos antes de generar el PDF
    var pdfDataElements = document.querySelectorAll('#pdf-data');
    pdfDataElements.forEach(function (element) {
      (element as HTMLElement).style.display = 'block';
    });

    var divElements = document.querySelectorAll('div');
    divElements.forEach(function (div) {
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

        var canvasElements = document.querySelectorAll('canvas');
        canvasElements.forEach(function (canvas) {
          canvas.style.backgroundColor = '#ffffff';
        });
        doc.save('tickets-dashboard.pdf');
        if (downloadButton) {
          downloadButton.style.display = 'block'; // Restaurar la visualización del botón de descarga
        }
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

  //manejo del routing desde las donas
  onChartClick(event: any): void {
    if (event.active.length > 0) {
      const clickedElementIndex = event.active[0].index;
      switch (clickedElementIndex) {
        case 0:
          this.router.navigate(['/tickets/ver']);
          break;
        case 1:
          this.router.navigate(['/tickets/ver']);
          break;
        default:
          break;
      }
    }
  }

  //dona
  tortasytortas() {
    // Configuración de la gráfica de dona
    this.donutChartLabels = ['Tickets Abiertos  ', 'Tickets Cerrados'];
    this.donutChartData1 = [
      {
        data: [this.t_abiertosX, this.t_cerradosX],
        backgroundColor: ['rgba(0, 28, 91, 0.8)', 'rgba(0, 204, 194, 0.8)'],
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
                ' Tickets | ' +
                percentage.toFixed(1) +
                ' %';

              return label;
            },
          },
        },
      },
    };
  }

  //obteneer la lista de los departamentos
  getTDepartament(): Promise<void> {
    return new Promise((resolve) => {
      this.ticketService.listDepartament().subscribe((data: any) => {
        this.tDepartament = data;
      });
      resolve();
    });
  }

  //construir la grafica tickets
  buildGraphicLine(tickets: any[]) {
    // Crear un objeto Map para contar las tickets por mes
    const TicketsPorMes = new Map<string, number>();
    const fechaActual = new Date();
    tickets.forEach((ticket) => {
      const fechaEntrega = new Date(ticket.fechaIngreso);
      if (
        fechaEntrega.getFullYear() === fechaActual.getFullYear() &&
        fechaEntrega.getMonth() <= fechaActual.getMonth()
      ) {
        const mes = fechaEntrega.toLocaleString('en-US', { month: 'long' });
        if (TicketsPorMes.has(mes)) {
          TicketsPorMes.set(mes, TicketsPorMes.get(mes) + 1);
        } else {
          TicketsPorMes.set(mes, 1);
        }
      }
    });

    // Generar la gráfica con los datos procesados
    const ticketsData: number[] = [];
    const ticketsLabels: string[] = [];
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
      ticketsLabels.push(mes);
      if (TicketsPorMes.has(mes)) {
        ticketsData.push(TicketsPorMes.get(mes));
      } else {
        ticketsData.push(0);
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
    this.barChartLabels = ticketsLabels;
    this.barcharType = 'line';
    this.barChartLegend = true;
    this.barChartData = [
      {
        data: ticketsData,
        label: 'Cantidad Tickets Por Mes',
        backgroundColor: 'rgba(87, 138, 237, 0.6)',
        borderColor: 'rgba(87, 138, 237)',
        pointBackgroundColor: 'rgba(87, 138, 237)',
        fill: true, // Añade esta línea para habilitar el sombreado
      },
    ];
  }

  //obtener el valor seleccionado en departamento
  getDep(e: any) {
    this.selectDepartament = e;
  }

  //capturar el mes seleccionado
  getMonth(e: any) {
    this.selectMes = e;
    const startDate = moment(this.selectMes, 'YYYY-MM').startOf('month');
    const endDate = moment(this.selectMes, 'YYYY-MM').endOf('month');
  }

  getMonthAsunto(e: any) {
    this.selectMesAsunto = e;
    const startDate = moment(this.selectMesAsunto, 'YYYY-MM').startOf('month');
    const endDate = moment(this.selectMesAsunto, 'YYYY-MM').endOf('month');
  }

  //capturar el mes seleccionado 2
  getMonth2(e: any) {
    this.selectMes2 = e;
    const startDate2 = moment(this.selectMes2, 'YYYY-MM').startOf('month');
    const endDate2 = moment(this.selectMes2, 'YYYY-MM').endOf('month');
  }

  //capturar el mes seleccionado 3
  getMonth3(e: any) {
    this.selectMes3 = e;
    const startDate3 = moment(this.selectMes3, 'YYYY-MM').startOf('month');
    const endDate3 = moment(this.selectMes3, 'YYYY-MM').endOf('month');
  }

  getCurrentMonthYear() {
    const currentDate = moment().format('YYYY-MM');
    return currentDate;
  }

  getCurrentMonthYear2() {
    const currentDate2 = moment().format('YYYY-MM');
    return currentDate2;
  }

  getCurrentMonthYear3() {
    const currentDate3 = moment().format('YYYY-MM');
    return currentDate3;
  }

  //obtiene los tickets de los usuarios en la grafica de barras
  getTicketsByUser(): Promise<void> {
    return new Promise((resolve) => {
      const startDate = moment(this.selectMes, 'YYYY-MM').startOf('month');
      const endDate = moment(this.selectMes, 'YYYY-MM').endOf('month');

      const fechaInicia = startDate.format('YYYY-MM-DD');
      const fechaFin = endDate.format('YYYY-MM-DD');

      this.ticketService
        .listarTicket(fechaFin, fechaInicia)
        .subscribe((data: any) => {
          this.tickets = data
            .sort(
              (a: any, b: any) =>
                parseInt(b.fechaIngreso) - parseInt(a.fechaIngreso)
            )
            .filter(
              (ticket: Ticket, index: number, arr: Ticket[]) =>
                arr.filter((t) => t.usuario === ticket.usuario).length >= 2
            )
            .reverse();

          this.createBarChart();
        });
      resolve();
    });
  }
}
