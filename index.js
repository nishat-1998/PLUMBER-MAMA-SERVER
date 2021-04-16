const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("hello from db it's  working")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.98xqu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const dataCollection = client.db("plumberStore").collection("booking");

    app.post('/addBooking', (req, res) => {
        const book = req.body;
        dataCollection.insertOne(book)

            .then(result => {
                res.send(result.insertedCount > 0);
            })
        })

        app.get('/booking', (req, res) => {
            dataCollection.find({})
                .toArray((err, documents) => {
                    res.send(documents);
                })
            })
    
        app.post('/bookingByDate', (req, res) => {
            const date = req.body;

            dataCollection.find({date:date.date})

                .toArray((err,documents) => {
                    res.send(documents);
                })
            })

    });


    app.listen(port, () => {
        // console.log(`Example app listening at http://localhost:${port}`)
       }) 