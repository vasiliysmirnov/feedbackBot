module.exports = (trelloClient, trelloIDList, message, messageText, feedbackTrigger) => {
    const userName = message.author.username;
    const content = messageText;
    const title = `${userName}: ${feedbackTrigger}`;

    let label = feedbackTrigger;
    const labels = {
      'bug': '5c90929511c9545a2d88731e',
      'request': '5c8fcda891d0c2ddc598f56f',
      'feedback': '5c8fcda891d0c2ddc598f56d',
      'suggestion': '5c8fcda891d0c2ddc598f56c',
      'idea': '5c8fcda891d0c2ddc598f56e',
      'spam': '5c976f311b6086306a620c16',
    }

    let myLabelId = labels[label]
    console.log(`Send Trello: ${title}`);

    return new Promise((resolve, reject) => {
      // create feedback card
      trelloClient.post("/1/cards", {idList: trelloIDList, name: title, idLabels: myLabelId, desc: content}, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  };
  