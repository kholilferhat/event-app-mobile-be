const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const router = require('./routes/router')

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));


app.use('/api', router)

app.get('/', (req, res) => {
    return res.status(200).send("asd")
})


module.exports = app