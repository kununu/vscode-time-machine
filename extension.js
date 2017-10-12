const vscode = require('vscode');
const {getFileHistory} = require('./helpers/getHistory');
const {getContents} = require('./helpers/getDiff');
const path = require('path');

function activate(context) {
  class GitWindowContentProvider {
    constructor() {
      console.log(vscode.window.activeTextEditor.document.uri);
      this._onDidChange = new vscode.EventEmitter();
      this.file = vscode.window.activeTextEditor.document.uri.fsPath;
    }
    
    getAsset(assetPath) {
      return vscode.Uri.file(path.join(__dirname, assetPath)).toString();
    }
    
    provideTextDocumentContent(uri) { 
      const history = getFileHistory(this.file);
      return this.generateChartView(history.getChartDataset(this.file));
    }
    
    generateChartView(data) {
      return `
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.bundle.js"></script>
        <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/circular-json@0.3.3/build/circular-json.js"></script>
        <script src="${this.getAsset('chart/chart.js')}"></script>
        <script>
          $(document).ready(function() {
            createChart(${JSON.stringify(data)}, '${this.file}');
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
  vscode.commands.registerCommand('extension.didClick', function (data) {
    const item = data._chart.config.data.datasets[data._datasetIndex];
    
    
    const relPath = path.relative(
      vscode.workspace.workspaceFolders[0].uri.fsPath,
      item.file
    );

    getContents(
      relPath,
      item.data[0].id,
      item.data[0].next
    ).then(documents => {
      return vscode.commands.executeCommand('vscode.diff', documents.left.uri, documents.right.uri, 'some diff').then((success) => {
      }, function(err) {
        console.log(err);
        vscode.window.showInformationMessage(err.message);    
      });  
    })
  });
  
  let disposable = vscode.commands.registerCommand('extension.vscodeTimeMachine', function () {
    let provider = new GitWindowContentProvider();
    vscode.workspace.registerTextDocumentContentProvider('time-machine', provider);
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

function deactivate() {
}

exports.deactivate = deactivate;