const mysql = require('mysql');

// Set database connection credentials
//Database Connection
// mysql://gctzapmw_access_control:access_control@165.73.83.171:3306/gctzapmw_access_control_db
const config = {
    host: "165.73.83.171",
    user: "gctzapmw_access_control",
    password: "access_control",
    database: "gctzapmw_access_control_db"
};

// Create a MySQL pool
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;