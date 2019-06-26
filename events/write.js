module.exports = (message, cardId) => {
    let time = new Date().toISOString();

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
        db.run('CREATE TABLE IF NOT EXISTS Users(username text, cardId text, time datetime)');
        db.run(`INSERT INTO Users
                VALUES(
                    '${message.author.id}',
                    '${cardId}',
                    '${time}'
                    )`);
    });
    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}