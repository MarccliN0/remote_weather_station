const express = require("express");
const { MongoClient } = require('mongodb');
const path = require('path');
const pbkdf2 = require('pbkdf2');

const app = express();

app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('pages'))

const url = 'mongodb://localhost:27017';
const clientdb = new MongoClient(url);

async function readDB(CollectionName) {
  await clientdb.connect();
  const db = clientdb.db('Project');
  const collection = db.collection(CollectionName);

  return collection;
}

//TODO: implement a better authentication system than browser pop-up
async function authentication(req, res, next) {
  let authheader = req.headers.authorization;

  if (!authheader) {
    res.setHeader('WWW-Authenticate', 'Basic')
    res.status(401);
    return next();
  }

  const salt = 'neverguess';

  let auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pw = pbkdf2.pbkdf2Sync(auth[1], salt, 1, 32, 'sha512').toString('hex');
  req.user = user;

  const db = await readDB('users');
  const userMatch = await db.find({username : user}).toArray();

 if(!userMatch.length || userMatch[0].password != pw){
    res.setHeader('WWW-Authenticate', 'Basic')
    return res.sendStatus(401);
  }
  return next()
}

app

  .use(authentication)

  .get('/', (req, res) => {
    res.redirect('/index');
  })

  .get('/index', (req, res) => {
    res.render('index.ejs');
  })

  .post('/postSettings',async (req, res) => {
    const data = req.body;
    const db = readDB('userSettings');
    (await db).insertMany([data]);
    //TODO: implement sending data to LPCXpresso 1549 board
  })

  .delete('/deletAccount', (req, res) => {

  })

  .get('/getCurrentValue', (req, res) => {
    const data = {
      temp: '25',
      humidity: '70%',
      lightLevel: '--'
    }
    res.send(data);
  })


  //TODO: implement logging out mechanics


  //TODO: customize with css

  //TODO: implement light level settings


app.listen(3000);


