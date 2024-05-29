const { Pool } = require('pg');
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err)=>{
    if(err){
        throw err;
    }
    else{
        console.log("Database Connected")
    }
});

module.exports = pool;