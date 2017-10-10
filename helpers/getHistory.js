const vscode = require('vscode');
const {spawn} = require('child_process');
const ParseGit = require('parse-git');
const {OUTPUT_CHANNEL_NAME} = require('../constants');
const path = require('path');
const moment = require('moment');

class History {
  constructor(log) {
    this.log = log;
  }

  getChartDataset() {
    let data = [];
    this.log.map(item => {
      let itemDate = moment(item.date).format('MM-DD-YYYY');
      let itemTime = moment(item.date).format('hh');
      console.log(itemTime)
      let foundIndex = data.findIndex((i) => i.label === itemDate);
      if (foundIndex > -1) {
          data[foundIndex].data[0].r += 5;
      } else {
      data.push({
          label: itemDate,
          backgroundColor: "rgba(255,255,255,0.5)",
          data:[{
            x: itemDate,
            y: itemTime,
            r: 5
          }]
        });
      }
    });
    return data;
  }

  c() {
    return this.log.map(item => {
      return {
        label: item.comment,
        backgroundColor: "rgba(255,255,255,0.5)",
        data:[{
          x: item.date,
          y: 3,
          r: 1
        }]
      }
    });
  }
  d() {
    return this.log.map(item => {
      return {
        id: item.id,
        date: item.date,
        comment: item.comment,
        author: `${item.author.name} <${item.author.email}>`
      }
    });
  }
}

function getHistoryString(absoluteFilePath) {
  return new Promise((resolve, reject) => {
    
    let ps = spawn('git', [
      '-C', 
      path.dirname(absoluteFilePath), 
      'log', 
      '--name-status',
      path.basename(absoluteFilePath)
    ]);
    
    const po = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    
    let tada = [];
    
    ps.stdout.setEncoding('utf8');
    ps.stdout.on('data', (data) => {
      tada.push(data);
    });
    
    ps.stderr.on('data', (data) => {
      po.appendLine(`err: ${data}`);
    });
    
    ps.on('close', (code) => {
      resolve(tada.join('\n'));
    });
  });
}

function getHistory(absoluteFilePath) {
  return getHistoryString(absoluteFilePath).then(data => new History(ParseGit.parseGit(data)));
}


exports.getHistory = getHistory;