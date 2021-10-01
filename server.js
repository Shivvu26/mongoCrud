const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'))

var connectionString = 'mongodb+srv://shiva:mongocrud@cluster0.k1qbj.mongodb.net/mongoCrud?retryWrites=true&w=majority';

MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('mongoCrud');
        const quotesCollection = db.collection('quotes');

        app.use(bodyParser.urlencoded({ extended: true }));

        app.listen(3000, function() {
            console.log('listening on 3000');
        })

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results });
                })
                .catch(error => console.error(error));
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result);
                    res.redirect('/')
                })
                .catch(error => console.error(error));
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Boy' },                       //filter
                {                                     //update
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {                                     //additional options
                    upsert: true                            //Insert a document if no documents can be updated.
                }
            )
                .then(result => {
                    res.json('Success');
                })
                .catch(error => {
                    console.error(error);
                });
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne( { name: req.body.name })
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Girl\'s quote')
                })
                .catch(error => console.error(error))
        })


    })
    .catch(console.error);



