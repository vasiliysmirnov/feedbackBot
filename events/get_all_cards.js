module.exports = (trelloClient, cardId) => {
    return new Promise((resolve, reject) => {
        trelloClient.get(`/1/cards/${cardId}/list`, (err, data) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });
};