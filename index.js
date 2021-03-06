const express = require('express');
const fetch = require('node-fetch');

const DARKSKYAPIKEY = require('./server/darksky_key.json');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/api/forecast', (req, res) => {
    console.log('incoming request!'); // dev
    console.log(req.query); // dev
    fetch(`https://api.darksky.net/forecast/${DARKSKYAPIKEY}/${req.query.lat},${req.query.lon}?lang=${req.query.lang}&units=si`)
        .then(data => data.json())
        .then(data => {
            console.log(data); // dev
            if (data.code === 403) {
                res.status(403).send(data);
            } else {
                res.status(200).send(data);
            };
        })
        .catch(err => {
            res.send(err);
        });
});


const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Server is listening on port ${port}`);
