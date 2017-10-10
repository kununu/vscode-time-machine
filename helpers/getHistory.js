const vscode = require('vscode');
const {spawn} = require('child_process');

function getHistory() {
    // git log --name-status .eslintrc.js > someFile.txt
    // git -C /Users/thomaspaulpetrovic/priv/dlvr log --name-status
    let ps = spawn('git', ['-C', vscode.workspace.rootPath, 'log', '--name-status']);
    //let ps = spawn('ls', [vscode.workspace.rootPath]);
    const po = vscode.window.createOutputChannel('processOutput');
    
    ps.stdout.on('data', (data) => {
        po.appendLine(data);
    });

    ps.stderr.on('data', (data) => {
        po.appendLine(`err: ${data}`);
    });

    ps.on('close', (code) => {
        po.appendLine(`Process killed with code: ${code}`);
    });
}

exports.getHistory = getHistory;