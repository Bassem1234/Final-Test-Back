const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const bodyParser = require('body-parser');
//set up exxpress app
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors({
    origin: "http://localhost:4200",
}));


app.use('/upload', express.static(__dirname +'/upload'));


//connect to mongoDB cloud
require('./database/connect');

//bearer strategy
require('./passport/bearerStrategy');

app.use(express.json());

//morgan config
app.use(morgan('dev'));

app.use(bodyParser.json()); 

//cron to reinitialize the download counter
const cron = require('./cron/reinDown');
app.use(cron);


//require routes
const catApi = require('./routes/categoryApi');
app.use('/api',catApi);
const livApi = require('./routes/livreApi');
app.use('/api',livApi);
const userApi = require('./routes/userApi');
app.use('/api',userApi);
const abonApi = require('./routes/abonneApi');
app.use('/api',abonApi);
const uploadApi = require('./routes/uploadApi');
app.use('/api',uploadApi);
const authApi = require('./routes/AuthApi');
app.use('/api', authApi);
const adminApi = require('./routes/adminApi');
app.use('/api',adminApi);


// listen for requests
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});