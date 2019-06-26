module.exports = (message, callback) => {
    // data base connection
    const sqlite3 = require('sqlite3').verbose();
    
    // open database
    let db = new sqlite3.Database('./db/users.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the users database.');
    });

    db.serialize(() => {
        db.all(`SELECT cardId
                FROM Users
                WHERE username = '${message.author.id}'
                `, (err, rows) => {
                    if (err){
                        console.log(err)
                    } else {
                        callback(rows)
                    }
                });
    });
    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
};