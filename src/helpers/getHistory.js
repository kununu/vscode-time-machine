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
        data[foundIndex].data[0].next = item.id;
        data[foundIndex].data[0].y +=  (item.linesAdded + item.linesDeleted);
        data[foundIndex].count++;
        data[foundIndex].label = `${parseInt(data[foundIndex].label.match(/\d+/)[0]) + 1} commits`
        data[foundIndex].data[0].messages.push(item.message)
      } else {
        data.push({
          label: '1 commit',
          hook: itemDate,
          file: file,
          backgroundColor: "rgba(255,255,255,0.5)",
          data:[{
            messages: [item.message],
            id: arr[idx+1] ? arr[idx+1].id : 0,
            next: item.id,
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