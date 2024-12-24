const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb').MongoClient;
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const mongoPath = process.env.MongoPath;
const Port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/state', (req, res) => {
    mongodb.connect(mongoPath).then((object) => {
        const database = object.db('StateDrop');
        database.collection('State').find({}).toArray().then((document) => {
            res.send(document);
            res.end();
        });
    });
});

app.listen(Port);
console.log(`server is running... http://127.0.0.1:${Port}`);