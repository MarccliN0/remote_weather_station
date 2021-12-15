const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const pbkdf2 = require('pbkdf2');
const cookieParser = require('cookie-parser');
const mqtt = require('mqtt')
const receiveClient = mqtt.connect('mqtt:://localhost:1883').subscribe('ConEnv/getdata');
const sendClient = mqtt.connect('mqtt:://localhost:1883').subscribe('ConEnv/senddata');

const app = express();

app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('pages'))
app.use(cookieParser());


//MongoDB Cluster connection 
//const url = "mongodb://localhost:27017"
//const url = 'mongodb+srv://Marci:Marci0704@iot3.s87ch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//const url = 'mongodb+srv://Marwan:1qaz2wsx@cluster0.oy2cj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//const clientdb = new MongoClient(url);



//function for MongoDB collection connection
// async function readDB(CollectionName) {
//   await clientdb.connect();
//   const db = clientdb.db('Project');
//   const collection = db.collection(CollectionName);

//   return collection;
// }

let db = new sqlite3.Database('./IoTProject.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('Successfull connection');
})

const salt = 'neverguess'; //salt for passsowrd encrytion

//TODO: implement a better authentication system than browser pop-up
//DONE -- working :D kinda, except the logout

receiveClient.on('connect', () => {
  console.log('Success MQTT Connect - receiveClient')
})

sendClient.on('connect', () => {
  console.log('Success MQTT Connect - sendClient')
})

function authentication(req, res, next) {
  let idcookie = req.cookies.idcookie;  //checking for indetification cookie
  if(idcookie) return next();   //if found continue, else return to login page
  res.redirect('/');
}

app

//   .use(async (req, res, next) => {

//   const promise = new Promise((resolve, reject) => {
//     receiveClient.on('message', (topic, message) => {
//       resolve(JSON.parse(message.toString()));
//       receiveClient.off('message');
//     })
//   })

//   const data = await promise;
//   if(!data) return next();
//   try {
//     let sql = 'INSERT INTO getdata (temperature, humidity, timestamp) VALUE (?,?,?)'
//     db.run(sql, [data.Temperature, data.Humidity, Date.now()], (err) => {
//       if (err) return console.log(err)
//       return next();
//     })
//   } catch (e) {
//     console.log(e);
//   }
//   return next();
// })

  .get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'pages/login.html')); 
  })

  .get('/index', authentication, (req, res) => {
    res.render('index.ejs');
  })

  .post('/postSettings', async (req, res) => {
    const data = req.body;
    let sql = 'INSERT INTO userSettings (mode, scheme, time, temperature, humidity, lightlevel) VALUES (?,?,?,?,?,?)';
    db.run(sql, [data.mode, data.scheme, Date.now(), data.temperature, data.humidity, data.lightlevel], (err) => {
      if (err) return console.log(err)
    })
    const newData = {
      temperature: data.temperature,
      humidity: data.humidity,
      lightlevel: data.lightlevel
    }
    const buffer = JSON.stringify(newData);
    sendClient.publish('ConEnv/senddata', buffer);

  })

  .delete('/deleteAccount', async(req, res) => {
    //TODO: implement a way to delete a user profile and all the data with it
    //DONE -- working :D
    let sql = 'DELETE FROM Users WHERE username = ?';
    db.run(sql, [req.body.username], (err) => {
			if (err) return console.log(err)
      console.log(`User deleted: username: ${req.body.username}`);
			res.redirect('/')
		})

  })

  .get('/getCurrentValue',  async (req, res) => {
    let sql = 'SELECT * FROM getdata ORDER BY timestamp DESC LIMIT 1'
    db.all(sql, [], (err, results) => {
			if (err) return console.log(err)
      res.send(results[0])
    })
  })

  .post('/login', async (req, res) => {
    const username = req.body.username;

    const pw = pbkdf2.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('hex');

    const promise = new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM Users WHERE username = ?';
      db.all(sql, [username], (err, result) => {
        if (err) {
          console.log(err)
          reject(err);
          return;
        }
        if (pw == result[0].password) return resolve(true);
        return resolve(false)
      })
    })

    let success = await promise;
    if(success != true) return res.redirect('/');
    res.cookie("idcookie", `${username}:${pw}`, { httpOnly: true, expires: new Date(Date.now() + 900000) });
    res.redirect('/index')
  })

  .post('/register', async (req, res) => {
    const username = req.body.username;
    const pw = pbkdf2.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('hex');

    let sql = 'INSERT INTO Users (username, password) VALUES (?,?)'
    db.run(sql, [username, pw], (err) => {
      if (err) return console.log(err)
    })

    res.cookie("idcookie", `${username}:${pw}`, {path: '/', expires: new Date(Date.now() + 900000) });
    res.redirect('/index');
  })

  .get('/archive', authentication, async (req, res) => {
    let sql = 'SELECT * FROM userSettings';
    db.all(sql, [], (err, results) => {
			if (err) return console.log(err)
      res.render('archive.ejs', {userSettings: results});
    })
  })

  .get('/chart', async (req, res) => {
    let sql = 'SELECT * FROM getdata ORDER BY timestamp DESC LIMIT 50'
    db.all(sql, [], (err, results) => {
			if (err) return console.log(err)
      res.send(results);
    })
  })

  .post('/logout', (req, res) => {
    //cookie not getting deleted in any methods, tried giving it the same properties and setting maxAge also, nothing works...
    res.clearCookie('idcookie')
  })


//TODO: implement logging out mechanics
//DONE -- working :D


//TODO: customize with css

//TODO: implement light level settings

app.use((req, res, next) => {
  res.status(404).send('404 Page not found')
})


app.listen(3000);


