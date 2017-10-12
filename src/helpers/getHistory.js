const moment = require('moment');
const GitLogUtils = require('git-log-utils');

class History {
  constructor(log) {
    this.log = log;
  }
  
  getChartDataset(file) {
    let data = [];
    this.log.map((item, idx, arr) => {
      let itemDate = moment.unix(item.authorDate).format('MM-DD-YYYY');
      let foundIndex = data.findIndex((i) => i.hook === itemDate);
      if (foundIndex > -1) {
        data[foundIndex].data[0].r += 3;
        data[foundIndex].data[0].id = arr[idx+1] ? arr[idx+1].id : 'master';
        data[foundIndex].data[0].y +=  (item.linesAdded + item.linesDeleted);
        data[foundIndex].count++;
      } else {
        data.push({
          label: this.count,
          hook: itemDate,
          file: file,
          backgroundColor: "rgba(255,255,255,0.5)",
          data:[{
            id: arr[idx+1] ? arr[idx+1].id : 'master',
            next: item.id,
            x: itemDate,
            y: (item.linesAdded + item.linesDeleted),
            r: 3
          }]
        });
      }
    });
    console.log('data => ', data);
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