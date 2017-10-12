function createChart(data, file) {
  var canvas = document.getElementById("timeMachineChart");
  var ctx = canvas.getContext('2d');
  
  var timeMachineChart = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: data
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label;
            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return [label].concat(value.messages);
          }
        }
      },
      'onClick': function (evt, item) {
        window.parent.postMessage({
          command: "did-click-link",
          data: vscodeCmd('extension.vscodeTimeMachineSelect', item)
        }, "file://");
      },
      title: {
        display: false
      }, scales: {
        xAxes: [{ 
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'MM YYYY'
            }
          },
          distribution: 'linear'
        }]
      }
    }
  });

  function vscodeCmd(name, args) {
    return 'command:' + name + '?' + encodeURIComponent(CircularJSON.stringify(args));
  } 
}