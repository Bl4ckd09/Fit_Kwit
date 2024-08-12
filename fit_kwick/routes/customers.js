var express = require('express');
var router = express.Router();

// List all customers
router.get('/', (req, res) => {
    let sqlquery = 'SELECT * FROM Customer';
    db.query(sqlquery, (err, results) => {
        if (err) {
            req.flash('error', 'Failed to retrieve customers.');
            return res.redirect('/');
        }

        res.render('list_customers', { customers: results });
    });
});

// Add a new customer - Display form
router.get('/add', (req, res) => {
    res.render('add_customer');
});

// Add a new customer - Process form
router.post('/add', (req, res) => {
    var { name, address, membership_type } = req.body;
    let sqlquery = 'INSERT INTO Customer (name, address, membership_type) VALUES (?, ?, ?)';
    db.query(sqlquery, [name, address, membership_type], (err, results) => {
        if (err) {
           req.send(`
                <script>
                    alert('Failed to add customer.');
                    window.location.href = '/';
                </script>
            `);
            res.redirect('/');
        }

        req.send(`
            <script>
                alert('Customer added successfully.');
                window.location.href = '/';
            </script>
        `);
           res.redirect('/');
    });
});



// Use a guest pass
router.post('/:id/use_guest_pass', (req, res) => {
    let customerId = req.params.id;
    let sqlquery = 'UPDATE Customer SET guest_passes = guest_passes - 1 WHERE customer_id = ? AND guest_passes > 0';
    db.query(sqlquery, [customerId], (err, results) => {
        if (err) {
            req.flash('error', 'Failed to use guest pass.');
            return res.redirect('/customers');
        }

        if (results.affectedRows > 0) {
            req.flash('success', 'Guest pass used successfully');
        } else {
            req.flash('error', 'No guest passes left');
        }
        res.redirect('/customers');
    });
});

module.exports = router;

