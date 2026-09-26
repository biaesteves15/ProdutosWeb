import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';

@Component({
  imports: [
    CommonModule,
    ChartModule
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  // Injeção de dependência
  private http = inject(HttpClient);

  // Gráficos
  graficoStatus = signal<Chart>(new Chart());
  graficoTipo = signal<Chart>(new Chart());
  graficoCategoria = signal<Chart>(new Chart());

  ngOnInit() {

    // =========================================================
    // GRÁFICO - PRODUTOS POR STATUS
    // =========================================================

    this.http.get<any[]>(
      'http://localhost:5097/api/v1/dashboard/produtos-por-status'
    )
    .subscribe((dados) => {

      const coresStatus: any = {
        'Ativo': '#22c55e',
        'Inativo': '#ef4444',
        'Esgotado': '#f59e0b'
      };

      const conteudo = dados.map(item => ({
        name: item.status,
        y: item.contagemProdutos,
        color: coresStatus[item.status] || '#6366f1'
      }));

      this.graficoStatus.set(
        new Chart({

          chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            animation: {
              duration: 1200
            }
          },

          title: {
            text: 'Produtos por Status',
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1e293b'
            }
          },

          subtitle: {
            text: 'Distribuição dos produtos cadastrados',
            style: {
              color: '#64748b'
            }
          },

          tooltip: {
            pointFormat:
              '<b>{point.y}</b> produtos<br>' +
              '<b>{point.percentage:.1f}%</b> do total'
          },

          plotOptions: {

            pie: {

              innerSize: '65%',

              borderWidth: 3,
              borderColor: '#ffffff',

              shadow: true,

              cursor: 'pointer',

              dataLabels: {

                enabled: true,

                format:
                  '<b>{point.name}</b><br>' +
                  '{point.y} produtos',

                style: {
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#334155',
                  textOutline: 'none'
                }

              },

              states: {

                hover: {
                  brightness: 0.15
                }

              }

            }

          },

          series: [
            {
              type: 'pie',
              name: 'Produtos',
              data: conteudo
            }
          ],

          legend: {
            enabled: false
          },

          credits: {
            enabled: false
          }

        })
      );

    });


    // =========================================================
    // GRÁFICO - PRODUTOS POR TIPO
    // =========================================================

    this.http.get<any[]>(
      'http://localhost:5097/api/v1/dashboard/produtos-por-tipo'
    )
    .subscribe((dados) => {

      const cores = [
        '#6366f1',
        '#06b6d4',
        '#8b5cf6',
        '#ec4899',
        '#f97316',
        '#22c55e',
        '#eab308',
        '#14b8a6'
      ];

      const conteudo = dados.map((item, indice) => ({
        name: item.tipo,
        y: item.contagemProdutos,
        color: cores[indice % cores.length]
      }));

      this.graficoTipo.set(
        new Chart({

          chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            animation: {
              duration: 1200
            }
          },

          title: {
            text: 'Produtos por Tipo',
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1e293b'
            }
          },

          subtitle: {
            text: 'Distribuição dos produtos por tipo',
            style: {
              color: '#64748b'
            }
          },

          tooltip: {

            pointFormat:
              '<b>{point.y}</b> produtos<br>' +
              '<b>{point.percentage:.1f}%</b> do total'

          },

          plotOptions: {

            pie: {

              innerSize: '65%',

              borderWidth: 3,
              borderColor: '#ffffff',

              shadow: true,

              cursor: 'pointer',

              dataLabels: {

                enabled: true,

                format:
                  '<b>{point.name}</b><br>' +
                  '{point.y}',

                style: {
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#334155',
                  textOutline: 'none'
                }

              },

              states: {

                hover: {
                  brightness: 0.15
                }

              }

            }

          },

          series: [
            {
              type: 'pie',
              name: 'Produtos',
              data: conteudo
            }
          ],

          legend: {
            enabled: false
          },

          credits: {
            enabled: false
          }

        })
      );

    });


    // =========================================================
    // GRÁFICO - QUANTIDADE POR CATEGORIA
    // =========================================================

    this.http.get<any[]>(
      'http://localhost:5097/api/v1/dashboard/produtos-por-categoria'
    )
    .subscribe((dados) => {

      const categorias: string[] = [];

      const quantidadeTotal: any[] = [];

      const cores = [
        '#6366f1',
        '#06b6d4',
        '#22c55e',
        '#f59e0b',
        '#ec4899',
        '#8b5cf6',
        '#f97316',
        '#14b8a6'
      ];

      dados.forEach((item, indice) => {

        categorias.push(item.categoria);

        quantidadeTotal.push({

          y: item.quantidadeTotal,

          color: cores[indice % cores.length]

        });

      });

      this.graficoCategoria.set(
        new Chart({

          chart: {
            type: 'column',
            backgroundColor: 'transparent',
            animation: {
              duration: 1200
            }
          },

          title: {

            text: 'Quantidade de Produtos por Categoria',

            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1e293b'
            }

          },

          subtitle: {

            text: 'Somatório da quantidade disponível em estoque',

            style: {
              color: '#64748b'
            }

          },

          xAxis: {

            categories: categorias,

            lineColor: '#cbd5e1',

            tickColor: '#cbd5e1',

            labels: {

              style: {
                fontSize: '12px',
                color: '#475569'
              }

            },

            title: {

              text: 'Categoria',

              style: {
                fontWeight: 'bold'
              }

            }

          },

          yAxis: {

            min: 0,

            gridLineColor: '#e2e8f0',

            title: {

              text: 'Quantidade de Produtos',

              style: {
                fontWeight: 'bold'
              }

            },

            labels: {

              style: {
                color: '#64748b'
              }

            }

          },

          tooltip: {

            backgroundColor: '#0f172a',

            borderColor: '#0f172a',

            borderRadius: 8,

            style: {
              color: '#ffffff'
            },

            headerFormat:
              '<span style="font-size:14px"><b>{point.key}</b></span><br/>',

            pointFormat:
              'Quantidade: <b>{point.y}</b>'

          },

          plotOptions: {

            column: {

              borderWidth: 0,

              borderRadius: 8,

              shadow: true,

              pointPadding: 0.15,

              groupPadding: 0.1,

              dataLabels: {

                enabled: true,

                style: {
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#334155',
                  textOutline: 'none'
                }

              },

              states: {

                hover: {
                  brightness: 0.1
                }

              }

            }

          },

          series: [
            {
              name: 'Produtos',
              type: 'column',
              data: quantidadeTotal
            }
          ],

          legend: {
            enabled: false
          },

          credits: {
            enabled: false
          }

        })
      );

    });

  }

}