var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');

const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
    db.query('SELECT * FROM Users WHERE username = ?', [username], (err, results) => {
        if (err) return done(err);
        if (!results.length) return done(null, false, { message: 'Incorrect username.' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            else return done(null, false, { message: 'Incorrect password.' });
        });
    });
}));

passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM Users WHERE user_id = ?', [id], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
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

// Configure session management
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

var flash = require('connect-flash');
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.engine('html', ejs.renderFile);

var customerData = {
    customer_id: 1,
    name: "John Doe",
    address: "123 Main St, Springfield",
    membership_type: "gold",
    guest_passes: 3
};


var bookingData = {
    booking_number: 101,
    date: "2024-08-15",
    time: "10:00:00",
    customer_id: 1,
    activity_type: "gym"
};

// Pass both customerData and bookingData to the routes
require("./routes/main3")(app, customerData, bookingData, db);

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
});

