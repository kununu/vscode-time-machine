const vscode = require('vscode');
const {spawn} = require('child_process');

function gitRunner(gitCmdArray) {
  return new Promise((resolve, reject) => {  
    let output = [];
    let commandBase = ['-C', vscode.workspace.rootPath];
    
    const ps = spawn('git', commandBase.concat(gitCmdArray));
    ps.stdout.on('data', (data) => {
      output.push(data);
    });

    ps.on('close', (code) => {
      resolve(output.join('/n'));
    });
  })
}

function getContents(file, hashLeft, hashRight) {
  return new Promise((resolve, reject) => {
    gitRunner(['show', `${hashLeft}:${file}`]).then(contentLeft => {
      gitRunner(['show', `${hashRight}:${file}`]).then(contentRight => {
        vscode.workspace.openTextDocument({
          language: 'javascript',
          content: contentLeft
        }).then(left => {
          vscode.workspace.openTextDocument({
            language: 'javascript',
            content: contentRight
          }).then(right => {
            resolve({
              left, 
              right
            });
          });
        })    
      });
    });
  })
}

exports.getContents = getContents;