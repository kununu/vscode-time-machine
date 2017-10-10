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
            return '<h1>Greetings from Marty McFly</h2>';
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
        vscode.window.showInformationMessage('if my calculations are correct, when this baby hits 88 miles per hour... ');
        console.log(JSON.stringify(getHistory));
        getHistory(vscode.workspace.rootPath);
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