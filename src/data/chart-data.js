export const data = {
    labels: ['Aug1', 'Aug2', 'Aug3', 'Aug4', 'Aug5','Aug6','Aug7','Aug8','Aug9','Aug10','Aug11','Aug12','Aug13','Aug14','Aug15'],
    datasets: [
      {
        label: 'My First dataset',
        fill: true,
        lineTension: 0.3,
        backgroundColor: 'rgba(225, 204,230, .3)',
        borderColor: 'rgb(205, 130, 158)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgb(205, 130,1 58)',
        pointBackgroundColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(0, 0, 0)',
        pointHoverBorderColor: 'rgba(220, 220, 220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: ["5000", "5010"],
      },
    
    ],
    options: {
        scales: {
          y: {
            ticks: {
              callback: v => `${v}K`
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}K`
            }
          },
          datalabels: {
            formatter: function(context) {
              return context + "k";
            }
          },
        }
      }
  };
  