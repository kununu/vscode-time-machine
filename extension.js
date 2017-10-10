// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {getHistory} = require('./helpers/getHistory');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  class GitWindowContentProvider {
    constructor() {
      this._onDidChange = new vscode.EventEmitter();
    }
    provideTextDocumentContent(uri) {
      
      let commitList = '';
      //console.log(vscode.window.activeTextEditor.document.fileName);
      return getHistory(vscode.window.activeTextEditor.document.uri.fsPath).then((history) => {
        console.log(history.log);
        return this.generateChartView(history.getChartDataset());
      });
    }
    
    generateChartView(data) {
      console.log(data);
      return `
        <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.bundle.js"></script>
        </head>
        <body>
        <canvas id="myChart" width="800" height="350"></canvas>
        <script>
        var ctx = document.getElementById("myChart").getContext('2d');
        new Chart(ctx, {
          type: 'bubble',
          data: {
            datasets: ${JSON.stringify(data)}
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
        </script>
        </body>
      `
    }
    get onDidChange() {
      return this._onDidChange.event;
    }
    update(uri) {
      this._onDidChange.fire(uri);
    }
  }
  
  let preview = vscode.Uri.parse('time-machine://authority/time-machine');
  let provider = new GitWindowContentProvider();
  vscode.workspace.registerTextDocumentContentProvider('time-machine', provider);
  
  let disposable = vscode.commands.registerCommand('extension.vscodeTimeMachine', function () {
    return vscode.commands.executeCommand('vscode.previewHtml', preview, vscode.ViewColumn.Two, 'FLUX 9001').then((success) => {
    }, function(err) {
      console.log(err);
      vscode.window.showInformationMessage(err.message);
      return;
    });
  }, function(err) {
    console.log(err);
    vscode.window.showInformationMessage(err.message);
    return;
  });
  
  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;