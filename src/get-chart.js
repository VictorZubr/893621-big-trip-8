import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const parseFormat = (str) => ({prefix: str.slice(0, str.indexOf(`X`)), postfix: str.slice(str.indexOf(`X`) + 1)});

export default (ctx, config) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: config.data,
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => {
            const format = parseFormat(config.formatter);
            return `${format.prefix}${val}${format.postfix}`;
          }
        }
      },
      title: {
        display: true,
        text: config.title.toUpperCase(),
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
          barThickness: `flex`,
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
      },
    }
  });
};
