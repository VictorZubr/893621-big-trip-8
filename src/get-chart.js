import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default (ctx, config) => {
  return new Chart(ctx,{
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`],
      datasets: [{
        data: [400, 300, 200, 160, 150, 100],
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: 'end',
          align: 'start',
          //formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


// const moneyChart = new Chart(moneyCtx, {
//   plugins: [ChartDataLabels],
//   type: `horizontalBar`,
//   data: {
//     labels: [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`],
//     datasets: [{
//       data: [400, 300, 200, 160, 150, 100],
//       backgroundColor: `#ffffff`,
//       hoverBackgroundColor: `#ffffff`,
//       anchor: `start`
//     }]
//   },
//   options: {
//     plugins: {
//       datalabels: {
//         font: {
//           size: 13
//         },
//         color: `#000000`,
//         anchor: 'end',
//         align: 'start',
//         formatter: (val) => `€ ${val}`
//       }
//     },
//     title: {
//       display: true,
//       text: `MONEY`,
//       fontColor: `#000000`,
//       fontSize: 23,
//       position: `left`
//     },
//     scales: {
//       yAxes: [{
//         ticks: {
//           fontColor: `#000000`,
//           padding: 5,
//           fontSize: 13,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//         barThickness: 44,
//       }],
//       xAxes: [{
//         ticks: {
//           display: false,
//           beginAtZero: true,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//         minBarLength: 50
//       }],
//     },
//     legend: {
//       display: false
//     },
//     tooltips: {
//       enabled: false,
//     }
//   }
// });