var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql');
var bodyParser = require('body-parser');

const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

var flash = require('connect-flash');
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'appuser',
    password: 'app2027',  
    database: 'fit_kwick'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.engine('html', ejs.renderFile);

var customerData = { customerId: "Amy Johns" };
var bookingData = { bookingNumber: "CustomerId" };

// Pass both customerData and bookingData to the routes
require("./routes/main1")(app, customerData, bookingData, db);

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
});

