const express = require("express");
const { MongoClient } = require('mongodb');
const path = require('path');
const pbkdf2 = require('pbkdf2');
const cookieParser = require('cookie-parser');

const app = express();

app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('pages'))
app.use(cookieParser());

const url = 'mongodb://localhost:27017';
const clientdb = new MongoClient(url);

async function readDB(CollectionName) {
  await clientdb.connect();
  const db = clientdb.db('Project');
  const collection = db.collection(CollectionName);

  return collection;
}

const salt = 'neverguess';

//TODO: implement a better authentication system than browser pop-up
// async function authentication(req, res, next) {
//   let authheader = req.headers.authorization;

//   if (!authheader) {
//     res.status(401);
//     return next();
//   }

//   let auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
//   const user = auth[0];
//   const pw = pbkdf2.pbkdf2Sync(auth[1], salt, 1, 32, 'sha512').toString('hex');
//   req.user = user;
//   console.log(auth);

//   let createAuth = new Buffer.from(auth).toString('base64');
//   console.log(createAuth)

//   const db = await readDB('users');
//   const userMatch = await db.find({ username: user }).toArray();

//   if (!userMatch.length || userMatch[0].password != pw) {
//     res.status(401);
//     return next();
//   }
//   return next()
// }
//lolo
async function authentication(req, res, next){
  let idcookie = req.cookies.idcookie;
  if(!idcookie){
    res.redirect('/')
  }else{
    next();
  }  
}

app

  

  .get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
  })

  .get('/index', authentication, (req, res) => {
    res.render('index.ejs');
  })

  .post('/postSettings', async (req, res) => {
    const data = req.body;
    const db = readDB('userSettings');
    (await db).insertMany([data]);
    //TODO: implement sending data to LPCXpresso 1549 board
  })

  .delete('/deletAccount', (req, res) => {
    //TODO: implement a way to delete a user profile and all the data with it
  })

  .get('/getCurrentValue', (req, res) => {
    //TODO: implement getting data from LPCXpresso 1549 board
    const data = {
      temp: '25',
      humidity: '70%',
      lightLevel: '--'
    }
    res.send(data);
  })

  .post('/login', async (req, res) => {
    const db = await readDB('users');
    const username = req.body.username;
    const userMatch = await db.find({username: username}).toArray();
    const pw = pbkdf2.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('hex');
    if(userMatch.length && userMatch[0].password == pw){
      res.cookie("idcookie", `${username}:${pw}`,{ httpOnly: true, expires: new Date(Date.now() + 900000)});
      res.redirect('/index')
    }
  })
//lol
  .post('/register', async( req, res) => {
    const db = await readDB('users');
    const username = req.body.username;
    const pw = pbkdf2.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('hex');

    const data = {
      username: username,
      password: pw
    }
    db.insertMany([data]);
  })




//TODO: implement logging out mechanics

//check if commit appears in gitlab 

//TODO: customize with css

//TODO: implement light level settings

app.use((req, res, next) => {
  res.status(404).send('Page not found')
}) 


app.listen(3000);


