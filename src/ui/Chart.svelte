<script>
    import { Line } from 'svelte-chartjs';
  
    import {filteredValues
    } from "../store/store";
    import {
      Chart as ChartJS,
      Title,
      Tooltip,
      Legend,
      LineElement,
      LinearScale,
      PointElement,
      CategoryScale,
    } from 'chart.js';


 const priceData = $filteredValues.map(flight => flight.price);

 const data = {
    labels: ['Aug1', 'Aug2', 'Aug3', 'Aug4', 'Aug5','Aug6','Aug7','Aug8','Aug9','Aug10','Aug11','Aug12','Aug13','Aug14','Aug15'],
    datasets: [
      {
        label: 'My First dataset',
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(225, 204,230, .3)',
        borderColor: '#295589',
        borderCapStyle: 'none',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'round',
        pointBorderColor: '#295589',
        pointBackgroundColor: '#295589',
        pointBorderWidth: 5,
        borderWidth : 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(0, 0, 0)',
        pointHoverBorderColor: 'rgba(220, 220, 220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 3,
        data: priceData,
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
  

  
    ChartJS.register(
      Title,
      Tooltip,
      Legend,
      LineElement,
      LinearScale,
      PointElement,
      CategoryScale
    );
  </script>
  
  <Line {data} options={{ responsive: true }} />
  