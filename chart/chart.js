function createChart(data) {
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
    return 'command:' + name + '?' + encodeURIComponent(JSON.stringify(args));
  } 

  function getData(event) {
    var points = timeMachineChart.getElementsAtEvent(event);
    if (points[0]) {
      var f = points[0]['_chart'].config.data.datasets[0].data[0];
      console.log(f)
      return f;
    }
  }
  $('#timeMachineChart').on('click', function(evt) {
    var data = getData(evt);

    window.parent.postMessage({
      command: "did-click-link",
      data: vscodeCmd('extension.didClick', data)
    }, "file://");
  });

}