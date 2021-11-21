const express = require("express");
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('views'))

const url = 'mongodb://localhost:27017';
const clientdb = new MongoClient(url);

async function readDB(CollectionName) {
  await clientdb.connect();
  const db = clientdb.db('Project');
  const collection = db.collection(CollectionName);

  return collection;
}

app

.get('/', (req, res) => {
  res.send('Welcome to the IoT Project');
})


