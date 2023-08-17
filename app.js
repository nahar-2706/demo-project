require('dotenv').config();
const express = require('express');
const httpStatus = require('./config/httpStatus');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');


app.use(cors({
    credentials: true,
    origin: function (_origin, callback) {
        callback(null, true)
    }
}))

require('./config/dbConnection');

app.use(express.json())
app.use('/public', express.static('public'));
app.get('/', (_req, res) => {
    return res.status(httpStatus.SUCCESS.statusCode).send('WELCOME TO MONGO DB BACKEND..')
})

app.use('/', require('./routes'))
app.listen(port, (err) => {
    if (err) {
        console.log('something went wrong...')
    }
    console.log(`Listening on port ${port}`)
})