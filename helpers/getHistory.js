const vscode = require('vscode');
const {spawn} = require('child_process');
const ParseGit = require('parse-git');
const {OUTPUT_CHANNEL_NAME} = require('../constants');
const path = require('path');
const moment = require('moment');
const GitLogUtils = require('git-log-utils');

  class History {
  constructor(log) {
    this.log = log;
  }

  getChartDataset() {
    let data = [];
    this.log.map(item => {

      let itemDate = moment.unix(item.authorDate).format('MM-DD-YYYY');
      let foundIndex = data.findIndex((i) => i.hook === itemDate);
      if (foundIndex > -1) {
          data[foundIndex].data[0].r += 3;
      } else {
      data.push({
          label: [item.message],
          hook: itemDate,
          backgroundColor: "rgba(255,255,255,0.5)",
          data:[{
            x: itemDate,
            y: (item.linesAdded + item.linesDeleted),
            r: 3
          }]
        });
      }
    });
    return data;
  }
}

function getFileHistory(absoluteFilePath) {
  try {
  return new History(GitLogUtils.getCommitHistory(absoluteFilePath));
  } catch(e) {
    console.log('error: ', e);
  }
}

exports.getFileHistory = getFileHistory;