var express = require('express');
var router = express.Router();

// List all bookings for a customer
router.get('/:customer_id', (req, res) => {
    let customerId = req.params.customer_id;
    let sqlquery = 'SELECT * FROM Booking WHERE customer_id = ?';
    db.query(sqlquery, [customerId], (err, results) => {
        if (err) {
            req.flash('error', 'Could not retrieve bookings.');
            return res.redirect('/');
        }

        res.render('list_bookings', { bookings: results });
    });
});

// Add a booking - Display form
router.get('/add', (req, res) => {
    let sqlquery = 'SELECT * FROM Customer';
    db.query(sqlquery, (err, results) => {
        if (err) {
            req.flash('error', 'Could not load customers.');
            return res.redirect('/');
        }

        res.render('make_booking', { customers: results });
    });
});

// Add a booking - Process form
router.post('/add', (req, res) => {
    var { customer_id, date, time, activity_type } = req.body;
    let sqlquery = 'INSERT INTO Booking (customer_id, date, time, activity_type) VALUES (?, ?, ?, ?)';
    db.query(sqlquery, [customer_id, date, time, activity_type], (err, results) => {
        if (err) {
            req.flash('error', 'Could not add booking.');
            return res.redirect('/bookings/add');
        }

        req.flash('success', 'Booking added successfully');
        res.redirect('/bookings/' + customer_id);
    });
});

// Delete a booking
router.post('/:booking_number/delete', (req, res) => {
    let bookingNumber = req.params.booking_number;
    let sqlquery = 'DELETE FROM Booking WHERE booking_number = ?';
    db.query(sqlquery, [bookingNumber], (err, results) => {
        if (err) {
            req.flash('error', 'Could not delete booking.');
            return res.redirect('back');
        }

        req.flash('success', 'Booking deleted successfully');
        res.redirect('back');
    });
});

module.exports = router;

