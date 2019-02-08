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

app.init = () => {
    app.readyToAcceptRequest = true;
    pool.query("CREATE TABLE data(numbers int)", (error, results) => {
        if (error) {
            console.error("Error -------> " + error);
            return;
        }

        console.log("Table created");
    });
}
app.use(express.json());

app.post('/number', (req, res) => {
    pool.query(`INSERT INTO data VALUES(${req.body.number})`, (error, result) => {
        if (error) throw error;

        console.log(`Inserted data sucessfully`);
        res.send("Inserted data sucessfully");
    });
});

app.get('/number', (req, res) => {
    pool.query("SELECT numbers FROM data", (error, results) => {
        if (error) throw error;
        let result = results.rows.map(element => element.numbers);

        console.log(result);
        res.send(JSON.stringify(result));
    });
});

app.get('/status', (req, res) => {
    app.readyToAcceptRequest ? res.sendStatus(200) : res.sendStatus(503);
});

app.put('/rest', (req, res) => {
    app.readyToAcceptRequest = false;
    setTimeout(() => {
        app.readyToAcceptRequest = true;
        res.end();
    }, 10000);
});

module.exports = app;
