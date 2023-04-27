const express = require('express');
const sql = require('mssql')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const bcrypt = require('bcrypt');

const saltRounds = 10;
const PORT = 3001;
var dbConnected = false;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(didConnect); // ensures all requests to server are denied until database connection is successful

dbConnect();

function didConnect(req, res, next) {
    if(dbConnected)
        next();
    else
        res.status(400).send({status: 'failure', message: 'database not connected, please wait.'});
}

async function dbConnect() {
    // config for database connection
    try {
        await sql.connect({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            server: String(process.env.DB_SERVER),
            database: process.env.DB_NAME,
        });
        dbConnected = true;
        console.log('Database connection established.');
    } catch(err) {
        console.log('!!! Could not connect !!! Error: ');
        dbConnected = false;
        throw err;
    }
}


// Routes

app.get("/incidents", async (req, res) => {
    let result = await sql.query`SELECT * FROM Incidents`;
    res.send(result.recordset);
});

app.get("/popular", async (req, res) => {
    let result = await sql.query`SELECT * FROM Incidents ORDER BY watching DESC`;
    //console.log(result.recordset);
    res.send(result.recordset);
});

app.get("/latest", async (req, res) => {
    let result = await sql.query`SELECT * FROM Incidents ORDER BY incidentID DESC`;
    //console.log(result.recordset)
    res.send(result.recordset);
});

app.get("/getwatchlist/:id", async (req, res) => {
    //console.log(req.params.id)
    let result = await sql.query`SELECT IncidentId FROM Watching WHERE UserId = ${req.params.id}`;
    // console.log(result.recordset)
    res.send(result.recordset);
});
app.get("/getStory/:id", async (req,res)=>{
    console.log(req.params.id.slice(1,req.params.id.length-1),"REQID")
    const idList = JSON.parse(req.params.id)

    let result = await sql.query`SELECT header FROM Incidents WHERE incidentID IN (${idList})`;
    console.log(result.recordset[0],"RECORD")
    res.send(result.recordset)
})
app.post('/removewatching', async (req, res) => {
    console.log(req.body.username)
    let result = await sql.query`DELETE FROM Watching WHERE UserId = ${req.body.userID} AND incidentId=${req.body.storyID}`;
    console.log(result,"removewatching")
});

app.post('/watching', async (req, res) => {
    console.log(req.body.username)
    let result = await sql.query`insert into Watching (UserId, incidentId) values (${req.body.userID}, ${req.body.storyID})`;
    console.log(result,"watching")
});

app.get('/userCounties/:userId', async (req, res) => {
    let result = await sql.query`select name from Counties where userId=${req.params.userId}`.catch((err) => {
        console.log(err);
        res.sendStatus(500)
        return;
    })
    res.send(result.recordset);
});

app.post('/saveCounty', async (req, res) => {
    try {
        let result = await sql.query`insert into Counties (userId, name) values (${req.body.userId}, ${req.body.county})`;
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }
});

app.get('/deleteCounty/:userId/:county', async (req, res) => {
    await sql.query`delete from Counties where userId=${req.params.userId} and name=${req.params.county}`
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
            return;
        });
    res.sendStatus(200);
}); 

app.post('/signup', async (req, res) => {
    console.log(req.body);
    if(req.body.username == undefined || req.body.password == undefined) {
        res.status(400).send({status: 'failure', message: 'Username or password empty'});
        return;
    }

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
    let result = await sql.query`select * from Users where username=${req.body.username}`;
    if(result.rowsAffected == 0) { // no matching email
        res.status(400).send({status: 'failure', message: 'No matching email'})
        return;
    }
    let match = await bcrypt.compareSync(req.body.password, result.recordset[0]['password']);
    if(!match) { // password mismatch
        res.status(400).send({status: 'failure', message: 'Password mismatch'});
        return;
    }
    res.status(200).send({status: 'success', message: 'Login successful', user: result.recordset[0]});

});

app.get("/ping", async (req, res) => {
    let result = await sql.query(`SELECT GETDATE()`);
    console.dir(result);
    res.send({'':'pong at ' + result.recordset[0]['']});
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});