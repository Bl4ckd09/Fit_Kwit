module.exports = function(app, dataset, db) {

    // Home Route
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // Customers Routes
    app.get('/customers', function(req, res) {
        let sqlquery = "SELECT * FROM Customer";
        db.query(sqlquery,function (err, results) {
            if (err) {
                console.error(err.message);
                res.flash('error', 'Failed to retrieve customers.');
               
            } else{
            res.render('list_customers.ejs', { customers: results });
          } 
           return res.redirect('/');
       });
    });

    app.get('/customers/add', function(req, res) {
        res.render('add_customer.ejs');
    });

    app.post('/customers/add-result', function(req, res) {
        let  { name, address, membership_type, guest_passes } = req.body;
        let sqlquery = "INSERT INTO Customer (name, address, membership_type,guest_passes) VALUES (?, ?, ?, ?)";
        db.query(sqlquery, [name, address, membership_type], function(err, results) {
            if (err) {
                res.flash('error', 'Failed to add customer.');
               
            } else{
            res.flash('success', 'Customer added successfully.');
           }
          return res.redirect('/');
        });
    });

    app.post('/customers/:id/use_guest_pass', function(req, res) {
        let customerId = req.params.id;
        let sqlquery = "UPDATE Customer SET guest_passes = guest_passes - 1 WHERE customer_id = ? AND guest_passes > 0";
        db.query(sqlquery, [customerId], function(err, results) {
            if (err) {
                res.flash('error', 'Failed to use guest pass.');
                return res.redirect('/customers');
            }
            if (results.affectedRows > 0) {
                res.flash('success', 'Guest pass used successfully');
            } else {
                res.flash('error', 'No guest passes left');
            }
            res.redirect('/customers');
        });
    });

    // Bookings Routes

    app.get('/bookings/:customer_id', function(req, res) {
        let customerId = req.params.customer_id;
        let sqlquery = "SELECT * FROM Booking WHERE customer_id = ?";
        db.query(sqlquery, [customerId], function(err, results) {
            if (err) {
                res.flash('error', 'Failed to retrieve bookings.');
                return res.redirect('/');
            }
            res.render('list_bookings.ejs', { bookings: results });
        });
    });

    app.get('/bookings/add', function(req, res) {
        let sqlquery = "SELECT * FROM Customer";
        db.query(sqlquery,function (err, results) {
            if (err) {
                res.flash('error', 'Failed to load customers.');
                return res.redirect('/');
            }
            res.render('make_booking.ejs', { customers: results });
        });
    });

    app.post('/bookings/add', function(req, res) {
        let { customer_id, date, time, activity_type } = req.body;
        let sqlquery = "INSERT INTO Booking (customer_id, date, time, activity_type) VALUES (?, ?, ?, ?)";
        db.query(sqlquery, [customer_id, date, time, activity_type], function(err, results) {
            if (err) {
                res.flash('error', 'Failed to add booking.');
                return res.redirect('/bookings/add');
            } else{
            res.flash('success', 'Booking added successfully');
            res.redirect('/bookings/' + customer_id);
         }  
      });
    });

    app.post('/bookings/:booking_number/delete', function(req, res) {
        let bookingNumber = req.params.booking_number;
        let sqlquery = "DELETE FROM Booking WHERE booking_number = ?";
        db.query(sqlquery, [bookingNumber], function(err, results) {
            if (err) {
                res.flash('error', 'Failed to delete booking.');
                return res.redirect('back');
            } else {
            res.flash('success', 'Booking deleted successfully');
            res.redirect('back');
          }
        });
    });
};

