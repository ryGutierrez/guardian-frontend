const express = require('express');
const sql = require('mssql')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const bcrypt = require('bcrypt');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const nodemailer = require('nodemailer');

const saltRounds = 10;
const PORT = 3001;
var dbConnected = false
const NOTIFY_INTERVAL_MS = 30000;
var timeLastNotified = getDateTime();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_EMAIL,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    }
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(didConnect); // ensures all requests to server are denied until database connection is successful

dbConnect();

// Functions

// Functions

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

// 
function padNum(num, n) {
    return '0'.repeat(n - (num+'').length)+num
}

function getDateTime() {
    let now = new Date();
    return `${now.getFullYear()}-${padNum(now.getMonth() + 1, 2)}-${padNum(now.getDate(), 2)} ${padNum(now.getHours(), 2)}:${padNum(now.getMinutes(), 2)}:${padNum(now.getSeconds(), 2)}.${padNum(now.getMilliseconds(), 3)}`
}

async function notifyUsers() {
    console.log(`Starting notifyUsers at ${getDateTime()}`)
    let result = await sql.query`select header, date, county from Incidents
    where date > ${timeLastNotified} and county not in ('null', 'NULL', 'N/A', '*N/A*')`;
    let newIncidents = result.recordset;

    result = await sql.query`select username, email, name as county from Users join Counties on Users.userID = Counties.userId`
    let usersJoinCounties = result.recordset;

    for(const userRow of usersJoinCounties) {
        for(const incidentRow of newIncidents) {
            let splitCounties = incidentRow.county.split(', ');
            for(const s of splitCounties) {
                if(s.includes(userRow.county)) {
                    console.log(`Sending notification to ${userRow.username} with email: ${userRow.email}:\n\t${incidentRow.header}\n\tin ${userRow.county}`);
                    // twilio.messages.create({
                    //     body: `ALERT! ${incidentRow.header}\nLocation: ${s}${s.includes('County') ? "" : " County"}`,
                    //     to: '+1',
                    //     from: process.env.TWILIO_PHONE_NUMBER,
                    // }).then((message) => console.log(message.sid));
                    transporter.sendMail({
                        from: process.env.DEV_EMAIL,
                        to: userRow.email,
                        subject: 'Guardian Notification',
                        text: `ALERT! ${incidentRow.header}\nLocation: ${s}${s.includes('County') ? "" : " County"}`,
                    }, (error, info) => {
                        if(error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            }
        }
    }
    

    timeLastNotified = getDateTime();
    console.log(`Ending notifyUsers at ${timeLastNotified}`);


}

setInterval(notifyUsers, NOTIFY_INTERVAL_MS);


// Routes

app.get("/incidents", async (req, res) => {
    let result = await sql.query`SELECT * FROM Incidents`;
    res.send(result.recordset);
});
app.get("/getsubscriptions/:id",async (req,res)=>{
    console.log(req.params.id)
    async function fetchSub() {
        // await response of fetch call
        let response =  await sql.query`SELECT * FROM Subscriptions WHERE userID = ${req.params.id}`;;
        // only proceed once promise is resolved
        let data = await response.recordset.length;
        console.log(data,"Data")
        return data;
    }
    fetchSub().then(async (data)=>{
        if(data===0){
            res.send("F")
        }
        else{
            console.log("FETCHSUB")
            let result = await sql.query`SELECT * FROM Incidents INNER JOIN Subscriptions ON Incidents.tag = Subscriptions.tagID WHERE Subscriptions.userID = ${req.params.id};`
            console.log(result.recordset,"RECODSET")
            res.send(result.recordset)
        }
    })
    // res.send(result.recordset);
})
app.post("/removesubscription/:id/:tag",async (req,res)=>{
    console.log(req.params.id)
    await sql.query`DELETE from Subscriptions WHERE userID = ${req.params.id} AND tagID=${req.params.tag}`
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        return;
    });
    res.sendStatus(200);
})
app.post("/addsubscription/:id/:tag",async (req,res)=>{
    console.log(req.params.id)
    let result = await sql.query`insert into Subscriptions (userID,tagID) values (${req.params.id},${req.params.tag})`;
    res.sendStatus(200);
})
app.get("/popular", async (req, res) => {
    let result = await sql.query`SELECT TOP 100 * FROM Incidents ORDER BY watching DESC`;
    //console.log(result.recordset);
    res.send(result.recordset);
});

app.get("/latest", async (req, res) => {
    let result = await sql.query`SELECT TOP 100 * FROM Incidents ORDER BY incidentID DESC`;
    //console.log(result.recordset)
    res.send(result.recordset);
});

app.get("/getwatchlist/:id", async (req, res) => {
    //console.log(req.params.id)
    let result = await sql.query`SELECT IncidentId FROM Watching WHERE UserId = ${req.params.id}`;
    console.log(result.recordset.length,"LENGTH")
    if(result.recordset.length===0){
        console.log("WHAT IS WE DOING")
        res.send("NO RECORDS")
    }
    else{
        res.send(result.recordset);
    }
});
app.get("/getStory/:id", async (req,res)=>{
    // console.log(req.params.id.slice(1,req.params.id.length-1),"REQID")
    const idList = JSON.parse(req.params.id)

    let result = await sql.query`SELECT * FROM Incidents WHERE incidentID IN (${idList})`;
    // console.log(result.recordset[0],"RECORD")
    res.send(result.recordset)
})
app.post('/removewatching/:id/:userid', async (req, res) => {
    console.log(req.params.id,req.params.userid,)
    let result = await sql.query`DELETE FROM Watching WHERE UserId = ${req.params.userid} AND incidentId=${req.params.id}`;
    console.log(result)
    res.sendStatus(200);
});

app.post('/watching', async (req, res) => {
    console.log(req.body.username)
    let result = await sql.query`insert into Watching (UserId, incidentId) values (${req.body.userID}, ${req.body.storyID})`;
    console.log(result,"watching")
    res.sendStatus(200);
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
        console.log(result.recordset[0],"resultAF")
        res.status(400).send({status: 'failure', message: 'No matching email'})
        return;
    }
    let match = await bcrypt.compareSync(req.body.password, result.recordset[0]['password']);
    if(!match) { // password mismatch
        console.log(result.recordset[0],"resultMIS")
        res.status(400).send({status: 'failure', message: 'Password mismatch'});
        return;
    }
    console.log(result.recordset[0],"result")
    res.status(200).send({status: 'success', message: 'Login successful', user: result.recordset[0]});

});

app.post('/postComment', async (req, res) => {
    try {
        console.log('Received body: '+JSON.stringify(req.body))
        let result = await sql.query`insert into Comments (userID, incidentID, content, datePosted) values (${req.body.userId}, ${req.body.incidentId}, ${req.body.content}, ${getDateTime()})`;
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.send(500)
    }
});

app.get('/deleteComment/:commentId', async (req, res) => {
    
    let result = await sql.query`delete from Comments where commentID = ${parseInt(req.params.commentId)}`;
    console.log(result)
    if(result.rowsAffected == 0) {
        res.sendStatus(404);
    } else {
        res.sendStatus(200);
    }
});

app.get('/getComments/:incidentId', async (req, res) => {
    let result = await sql.query`select commentID, incidentID, content, datePosted, username from Comments join Users on Comments.userID = Users.userID where incidentID = ${parseInt(req.params.incidentId)}`;
    console.log(result.recordset == undefined ? [] : result.recordset)
    res.send(result.recordset == undefined ? [] : result.recordset);
});


app.get("/ping", async (req, res) => {
    let result = await sql.query(`SELECT GETDATE()`);
    console.dir(result);
    res.send({'':'pong at ' + result.recordset[0]['']});
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});