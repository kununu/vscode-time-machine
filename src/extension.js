const vscode = require('vscode');
const path = require('path');
const {TimeChartWindowProvider} = require('./classes/TimeChartWindowProvider');
const {getContents} = require('./helpers/getDiff');

const {
  PROJECT_IDENTIFIER,
  TIMECHART_URI,
  TIMECHART_TITLE,
  TIMECHART_OPEN_COMMAND,
  TIMECHART_SELECT_COMMAND,
  TIMECHART_DIFF_TITLE
} = require ('./constants');

const activate = context => {
  
  let timeChartUri = vscode.Uri.parse(TIMECHART_URI);

  let disposable = vscode.commands.registerCommand(TIMECHART_OPEN_COMMAND, () => {
    let provider = new TimeChartWindowProvider();
    
    vscode.workspace.registerTextDocumentContentProvider(PROJECT_IDENTIFIER, provider);
    return vscode.commands.executeCommand(
      'vscode.previewHtml', 
      timeChartUri, 
      vscode.ViewColumn.Two, 
      TIMECHART_TITLE
    ).then(() => {
      // ???
    },(execErr) => {
      vscode.window.showInformationMessage(execErr.message);
    });

  },(disposeErr) => {
    vscode.window.showInformationMessage(disposeErr.message);
  });
  
  vscode.commands.registerCommand(TIMECHART_SELECT_COMMAND, function (data) {
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
      return vscode.commands.executeCommand(
        'vscode.diff', 
        documents.left.uri, 
        documents.right.uri, 
        TIMECHART_DIFF_TITLE
      ).then(() => {
        // ???
      }, function(execErr) {
        vscode.window.showInformationMessage(execErr.message);    
      });  
    })
  });

  context.subscriptions.push(disposable);
}

exports.activate = activate;