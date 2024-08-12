const express = require('express');
const bcrypt = require('bcryptjs');
var passport = require('passport');

module.exports = function(app, customerData, bookingData, db) {

//home
app.get('/', (req, res) => res.render('home.ejs', { req : req }));
app.get('/about', (req, res) => res.render('about.ejs'));

//route for registration and login
app.get('/register', (req, res) => res.render('register'));
app.post('/register', (req, res) => {
    let { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) throw err;
            res.redirect('/login');
        });
    });
});

app.get('/login', (req, res) => res.render('login.ejs'));

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//search route
app.get('/search', (req, res) => {
    let searchTerm = req.query.q;
    db.query('SELECT * FROM Customer WHERE name LIKE ?', [`%${searchTerm}%`], (err, results) => {
        if (err) throw err;
        res.render('search_results.ejs', { customers: results });
    });
});

//API
app.get('/api/customers', (req, res) => {
    db.query('SELECT * FROM Customer', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/api/bookings', (req, res) => {
    db.query('SELECT * FROM Booking', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


app.get('/public-api', async (req, res) => {
    const fetch = (await import('node-fetch')).default;

     fetch('https://api.publicapis.org/entries')
        .then(response => response.json())
        .then(data => res.render('public_api_data.ejs', { data: data.entries }))
        .catch(err => console.error(err));
});



    // Home Route
   // app.get('/', function(req, res) {
     //   res.render('index.ejs');
//    });

    // Customers Routes
    app.get('/customers', function(req, res) {
        let sqlquery = "SELECT * FROM Customer";
        db.query(sqlquery, function(err, result) {
            if (err) {
               req.flash('error', 'Failed to retrieve customers.');
             } else{
                res.render('list_customers.ejs', { customers: result });
            }
        });
    });

    app.get('/add-customers', function(req, res) {
        res.render('add_customer.ejs', customerData);
    });

    app.post('/customers/add', function(req, res) {
        let { name, address, membership_type } = req.body;
        let sqlquery = "INSERT INTO Customer (name, address, membership_type) VALUES  (?, ?, ?)";
        db.query(sqlquery, [name, address, membership_type], function(err, result) {
            if (err) {
                req.flash('error', 'Failed to add customer.')
            } else {
                req.flash('success', 'Customer added successfully.');
            };
        });
    });

    app.get('/use_guest_pass', function(req, res) {
        res.render('use_guest_pass.ejs', customerData);
    });


    app.post('/customers/customer_id/use_guest_pass', function(req, res) {
        let {customer_id} = req.body;
        let sqlquery = "UPDATE Customer SET guest_passes = guest_passes - 1 WHERE customer_id = ? AND guest_passes > 0";
        db.query(sqlquery, [customer_id], function(err, result) {
             if (err) {
                req.flash('error', 'No guest passes left.');
                res.redirect('/customers');            
           } else if (result.affectedRows > 0) {
                req.flash('success', 'Guest pass used successfully.');
   	  } 
        });
    });

  app.get('/bookings/customer_id', function(req, res) {
        let {customer_id} = req.body;
        let sqlquery = "SELECT * FROM Booking WHERE customer_id = ?";
        db.query(sqlquery, [customer_id], function(err, result) {
           if (err) {
                req.flash('error', 'Failed to find customer.');
                return res.redirect('/customers');
         }else{
            res.render('list_bookings.ejs', { bookings: result });
         }
        });
    });

    // Make a booking - Display form
    app.get('/add-bookings', function(req, res) {
        let sqlquery = "SELECT customer_id, name FROM Customer";
	db.query(sqlquery,function(err, result) {
	if (err) {
 		req.flash('error', 'Could not add booking.');
                return res.redirect('./');
	}else{
            res.render('make_bookings.ejs', {customers: result});
       }
 });

    // Add a booking - Process form
    app.post('/bookings/add', function(req, res) {
        let { date, time, customer_id, activity_type } = req.body;
        let sqlquery = "INSERT INTO Booking (date, time, customer_id, activity_type) VALUES (?, ?, ?, ?)";
        db.query(sqlquery, [date, time, customer_id, activity_type], function(err, result) {
            if (err) {
                req.flash('error', 'Could not add booking.');
                return res.redirect('./');
            }else{
            req.flash('success', 'Booking added successfully');
           
          }
        });
    });

    // Delete a booking
   app.get('/delete_bookings', function(req, res){
	res.render('delete_bookings.ejs', bookingData);
});


    app.post('/bookings/booking_number/delete', function(req, res) {
        let {booking_number} = req.params.booking_number;
        let sqlquery = "DELETE FROM Booking WHERE booking_number = ?";
        db.query(sqlquery, [booking_number], function(err, result) {
            if (err) {
                req.flash('error', 'Could not delete booking.');
                return res.redirect('/');
            }else{
            req.flash('success', 'Booking deleted successfully');
           }
        });
    });
 });
}
