const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port = process.env.PORT || 5055;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('Review'));
app.use(fileUpload());



app.get('/', (req, res) => {
    res.send("hello from db it's  working")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.98xqu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const adminCollection=client.db("plumberStore").collection("service");
  const dataCollection = client.db("plumberStore").collection("booking");
  const extraCollection = client.db("plumberStore").collection("review");
 

        
  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const subject = req.body.subject;  
    const ele = req.body.ele;
    const cost = req.body.cost;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
    contentType: file.mimetype,
     size: file.size,
     img: Buffer.from(encImg, 'base64')
     };

   adminCollection.insertOne({subject,ele,cost,image })
    .then(result => {
    res.send(result.insertedCount > 0);
         })
     })


     app.get('/bookingData', (req, res) => {
        adminCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });


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

            app.post('/addReview', (req, res) => {
                const file = req.files.file;
                const name = req.body.name;  
                const email = req.body.email;
                const comment = req.body.comment;
                const from = req.body.from;
                const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
       
        extraCollection.insertOne({ name, email, image,comment,from })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/reviews', (req, res) => {
        extraCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    });


    app.listen(port, () => {
        // console.log(`Example app listening at http://localhost:${port}`)
       }) 