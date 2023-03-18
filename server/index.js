const express = require('express');
const sql = require('mssql')
const cors = require('cors');
require('dotenv').config()

const app = express();
// app.set('trust proxy', 1);
app.use(cors());

const PORT = 3001;

// config for database connection
const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
}

// Routes

// return all incidnets
// `SELECT * FROM Incidents`
app.get("/incidents", async (req, res) => {
    await sql.connect(config, function(err) {
        if(err) console.log(err);
        var request = new sql.Request();

        request.query('SELECT * FROM Incidents', function (err, recordset) {
            if (err) console.log(err);
            res.send(recordset);
        });
    });
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});