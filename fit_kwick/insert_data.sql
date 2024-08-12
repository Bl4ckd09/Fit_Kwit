-- Insert data into the Users table
INSERT INTO Users (username, password) VALUES
('john_doe', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Cl.7s9.uQWT/v4HHiEPcWAKD6c2Ei'), -- Password is 'password123'
('jane_smith', '$2a$10$7JHpsnCnhtdC9RqJqJ7RheE5hXZrPTrSOvX6d4tjbFwrMJg26HQvO'); -- Password is 'mysecurepassword'

-- Insert data into the Customer table
INSERT INTO Customer (name, address, membership_type, guest_passes) VALUES
('Alice Johnson', '123 Elm Street, Springfield', 'gold', 3),
('Bob Williams', '456 Oak Avenue, Metropolis', 'silver', 2),
('Charlie Brown', '789 Maple Drive, Gotham', 'bronze', 1),
('Diana Prince', '101 Pine Lane, Themyscira', 'gold', 5);

-- Insert data into the Booking table
INSERT INTO Booking (booking_number, date, time, customer_id, activty_type) VALUES
(100001, '2024-08-20', '10:00:00', 1, 'gym'),  -- Alice Johnson
(100002, '2024-08-20', '11:00:00', 1, 'swim'), -- Alice Johnson
(100003, '2024-08-21', '09:00:00', 2, 'gym'),  -- Bob Williams
(100004, '2024-08-22', '15:00:00', 3, 'swim'), -- Charlie Brown
(100005, '2024-08-23', '12:00:00', 4, 'gym');  -- Diana Prince

