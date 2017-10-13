const vscode = require('vscode');
const path = require('path');
const {getFileHistory} = require('../helpers/getHistory');

class TimeChartWindowProvider {
  constructor() {
    this._onDidChange = new vscode.EventEmitter();
    this.file = vscode.window.activeTextEditor.document.uri.fsPath;
    this.language = vscode.window.activeTextEditor.document.languageId;
    console.log(this.language);
  }
  
  getAsset(assetPath) {
    return vscode.Uri.file(path.join(__dirname, assetPath)).toString();
  }
  
  provideTextDocumentContent(uri) {
    const history = getFileHistory(this.file);
    return this.generateChartView(history.getChartDataset(this.file, this.language));
  }
  
  generateChartView(data) {
    return `
    <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.bundle.js"></script>
      <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/circular-json@0.3.3/build/circular-json.js"></script>
      <script src="${this.getAsset('../../src/chart/chart.js')}"></script>
      <script>
      console.log('${this.getAsset('src/chart/chart.js')}');
        $(document).ready(function() {
          createChart(${JSON.stringify(data)});
        });
      </script>
    </head>
    <body>
      <h3>Time Machine for ${this.file}</h3>
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

exports.TimeChartWindowProvider = TimeChartWindowProvider;