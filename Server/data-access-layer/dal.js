const db = require("mysql");

const pool = db.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "luna_pharm"
});

function executeQueryAsync(sqlCmd) {
    return new Promise((resolve, reject) => {
        pool.query(sqlCmd, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}

module.exports = { executeQueryAsync };