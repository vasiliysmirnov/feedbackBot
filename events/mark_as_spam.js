module.exports = (trelloClient, cardId) => {

  return new Promise((resolve, reject) => {
    
    trelloClient.post(`/1/cards/${cardId}/idLabels`, {value: '5c976f311b6086306a620c16'}, (err, data) => {
      if (err) {
        // return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
};