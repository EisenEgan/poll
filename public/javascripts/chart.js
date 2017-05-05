console.log('syrup')
var Chart = require('chart.js')
var ctx = document.getElementById("myChart");
var data = {
  labels: [
      "Red",
      "Blue",
      "Yellow"
  ],
  datasets: [
      {
          data: [300, 50, 100],
          backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
          ],
          hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
          ]
      }]
      };

      var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: false,
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12
            }
          }
        }
        });
        var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
        responsive: false,
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12
          }
          }
          }
          });
