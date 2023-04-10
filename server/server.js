const express = require('express');
const sql = require('mssql')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
// app.set('trust proxy', 1);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3001;

dbConnect();

async function dbConnect() {
    // config for database connection
    try {
        await sql.connect({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            database: process.env.DB_NAME,
        });
        console.log('Database connection established.')
    } catch(err) {
        console.log('!!! Could not connect !!! Error: ');
        throw err;
    }
}
 
// Routes

// Return all rows from Incidents table
app.get("/incidents", async (req, res) => {
    let result = await sql.query`SELECT * FROM Incidents`;
    res.send(result.recordset);
});
app.get("/popular", async (req, res) => {
    let result = await sql.query`SELECT * FROM Incidents ORDER BY watching DESC`;
    console.log(result.recordset)
    res.send(result.recordset);
});
app.get("/latest", async (req, res) => {
    let result = await sql.query`SELECT * FROM Incidents ORDER BY incidentID DESC`;
    console.log(result.recordset)
    res.send(result.recordset);
});

// Create new user with username, email, and password if details don't already exist
app.post('/signup', async (req, res) => {
    let result = await sql.query`select count(*) from Users where username=${req.body.username} or email=${req.body.email}`;
    if(result.recordset[0][''] != 0) { // duplicate email/username found
        res.status(500).send({status: 'failure', message: 'Username or email taken'});
        return;
    }
    const hash = await bcrypt.hashSync(req.body.password, saltRounds);
    try {
        await sql.query`insert into Users (username, password, email) values (${req.body.username}, ${hash}, ${req.body.email})`;
        console.log('New user inserted into database');
        res.status(200).send({status: 'success', message: 'User created.'});
    } catch(err) {
        console.log(err);
    }
});

// Compare hashes for login success
app.post('/login', async (req, res) => {
    let result = await sql.query`select * from Users where email=${req.body.email}`;
    if(result.rowsAffected == 0) { // no matching email
        res.status(400).send({status: 'failure', message: 'No matching email'})
        return;
    }
    let match = await bcrypt.compareSync(req.body.password, result.recordset[0]['password']);
    if(!match) { // password mismatch
        res.status(400).send({status: 'failure', message: 'Password mismatch'});
        return;
    }
    res.status(200).send({status: 'success', message: 'Login successful'});
    
});

app.get("/ping", async (req, res) => {
    let result = await sql.query(`SELECT GETDATE()`);
    console.dir(result);
    res.send({'':'pong at ' + result.recordset[0]['']});
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});