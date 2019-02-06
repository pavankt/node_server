const fs = require("fs");
const express = require("express");
const Pool = require("pg").Pool;

const app = express();
const timeStamp = () => new Date();

const pool = new Pool({
    user: 'postgres',
    password: '',
    database: 'postgres',
    host: 'db',
    port: 5432
});

pool.query("CREATE TABLE data(numbers int)", (error, results) => {
    if (error) {
        console.error("Error -------> " + error);
        return;
    }

    console.log("Table created");
});

app.use(express.json());

app.use((req, res, next) => {
    let log = `${timeStamp()}: Requested for ${req.url}`;

    fs.appendFile('./logs/requestLogs.log', log + "\n", (err) => {
        if (err) throw err;
        console.log(`The "${log}" was appended to file!`);
    });
    next();
});

app.post('/addNumber', (req, res) => {
    pool.query(`INSERT INTO data VALUES(${req.body.number})`, (error, result) => {
        if (error) throw error;

        console.log(`Inserted data sucessfully`);
        res.write("Inserted data sucessfully");
        res.end();
    });
});

app.get('/numbers', (req, res) => {
    pool.query("SELECT numbers FROM data", (error, results) => {
        if (error) throw error;
        let result = results.rows.map(element => element.numbers);
        
        console.log(results.rows);
        res.write(JSON.stringify(result));
        res.end();
    });
});

module.exports = app;
