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

const url = 'mongodb+srv://Marci:Marci0704@iot3.s87ch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const clientdb = new MongoClient(url);

async function readDB(CollectionName) {
  await clientdb.connect();
  const db = clientdb.db('Project');
  const collection = db.collection(CollectionName);

  return collection;
}

const salt = 'neverguess';

//TODO: implement a better authentication system than browser pop-up


function authentication(req, res, next) {
  let idcookie = req.cookies.idcookie;
  if(idcookie) return next();
  res.redirect('/');
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
    const db = await readDB('userSettings');
    console.log(data);
    await db.insertMany([data]);
    //TODO: implement sending data to LPCXpresso 1549 board
  })

  .delete('/deleteAccount', async(req, res) => {
    //db.users.find({username: "user"});
    //db.users.remove({username: "user"})

    //TODO: implement a way to delete a user profile and all the data with it
    const db = await readDB('users');
    const username = req.body.username;
    const userMatch = await db.find({ username: username }).toArray();
    console.log(username);
    const pw = pbkdf2.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('hex');

    if (!userMatch.length || userMatch[0].password != pw) return 
    db.deleteOne({username:username});
    res.redirect('/')
    console.log("USer deleted");

  })

  .get('/getCurrentValue',  (req, res) => {
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
    const userMatch = await db.find({ username: username }).toArray();

    const pw = pbkdf2.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('hex');

    if (!userMatch.length || userMatch[0].password != pw) return 
    res.cookie("idcookie", `${username}:${pw}`, { httpOnly: true, expires: new Date(Date.now() + 900000) });
    res.redirect('/index')
  })

  .post('/register', async (req, res) => {
    const db = await readDB('users');
    const username = req.body.username;
    const pw = pbkdf2.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('hex');

    const data = {
      username: username,
      password: pw
    }
    db.insertMany([data]);
    res.cookie("idcookie", `${username}:${pw}`, { httpOnly: true, expires: new Date(Date.now() + 900000) });
    res.redirect('/index')
  })

  .get('/archive', authentication, async (req, res) => {
    let db = await readDB('userSettings');
    const userSettings = await db.find().toArray();
    res.render('archive.ejs', {userSettings: userSettings});
  })


//TODO: implement logging out mechanics

//TODO: customize with css

//TODO: implement light level settings

app.use((req, res, next) => {
  res.status(404).send('404 Page not found')
})


app.listen(3000);


