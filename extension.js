const vscode = require('vscode');
const {getFileHistory} = require('./helpers/getHistory');
const path = require('path');

function activate(context) {
  class GitWindowContentProvider {
    constructor() {
      this._onDidChange = new vscode.EventEmitter();
    }

    getAsset(assetPath) {
      return vscode.Uri.file(path.join(__dirname, assetPath)).toString();
    }

    provideTextDocumentContent(uri) {  
      const history = getFileHistory(vscode.window.activeTextEditor.document.uri.fsPath);
      return this.generateChartView(history.getChartDataset());
    }
    
    generateChartView(data) {
      return `
        <head>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.bundle.js"></script>
          <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
          <script src="${this.getAsset('chart/chart.js')}"></script>
          <script>
            $(document).ready(function() {
              createChart(${JSON.stringify(data)});
            });
          </script>
        </head>
        <body>
        <canvas id="timeMachineChart" width="800" height="350"></canvas>
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
  
  vscode.commands.registerCommand('extension.didClick', function (data) {
    return vscode.commands.executeCommand('vscode.diff', vscode.window.visibleTextEditors[0].document.uri, vscode.window.visibleTextEditors[0].document.uri, 'some diff').then((success) => {
    }, function(err) {
      vscode.window.showInformationMessage(err.message);    
    });
  });

  let disposable = vscode.commands.registerCommand('extension.vscodeTimeMachine', function () {
    return vscode.commands.executeCommand('vscode.previewHtml', preview, vscode.ViewColumn.Two, 'Time Machine').then((success) => {
    }, function(err) {
      vscode.window.showInformationMessage(err.message);
      return;
    });
  }, function(err) {
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