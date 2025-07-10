const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Twit = require('twit');  // Twitter API module
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = 3000;


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
const emailOTPStore = new Map(); // Stores { email -> otp }
const verifiedEmails = new Set(); // Stores verified emails


// SQLite DB setup
const db = new sqlite3.Database('./complaint.db', (err) => {
    if (err) {
        console.error("Error connecting to database: " + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create table if not exists (in app.js itself)
db.run(`
    CREATE TABLE IF NOT EXISTS complaints (
        complaintId TEXT PRIMARY KEY,
        name TEXT,
        contact TEXT,
        email TEXT,
        description TEXT,
        location TEXT,
        photo TEXT
    );
`, (err) => {
    if (err) {
        console.error('Error creating table: ' + err.message);
    } else {
        console.log('Table checked/created successfully.');
    }
});

// Email Setup (Gmail SMTP server)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'nagarcare@gmail.com',  // Gmail address
        pass: 'wklz zaex scfo gpmt'   // Generated App Password (instead of your regular password)
    }
});

// Twitter API Setup
const twitter = new Twit({
    consumer_key: '8W5v9ARXYsLWtTKdFMK7w6LeT',
    consumer_secret: 'GNlaAUVg490DH4i3xUDemZQjdpba9W1GMXDzYZEcMiEvMeoeVg',
    access_token: '1869015818698473472-gQIFCmoCYZdKNLW3uVWQWHsgn3vHLG',
    access_token_secret: 'dbhcY65Sxo72XQF2Gcqp7xrJ7qg2KrjGnDjM18psKNczU'
});

// Multer Setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to handle complaint submission
app.post('/submit-complaint', upload.single('photo'), (req, res) => {
    const { name, contact, email, description, location } = req.body;
    
    if (!verifiedEmails.has(email)) {
        return res.json({ success: false, message: 'Email not verified with OTP.' });
    }


    const complaintId = Math.floor(Math.random() * 9000000) + 1000000; // Random 7-digit number

    // If a photo is uploaded, save it to disk
    const photoPath = req.file ? req.file.path : null;

    // SQL query to insert the complaint into the database
    const stmt = db.prepare("INSERT INTO complaints (complaintId, name, contact, email, description, location, photo) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    stmt.run(complaintId, name, contact, email, description, location, photoPath, function(err) {
        if (err) {
            console.error("Error inserting complaint: ", err.message);
            return res.json({ success: false, message: 'Error registering complaint.' });
        }

        console.log("Complaint inserted successfully with ID: ", complaintId);

        // Send email notification to the user
        const mailOptions = {
            from: 'nagarcare@gmail.com',
            to: `${email}`,
            subject: 'Complaint Registered Successfully',
            text: `Dear ${name},

Thank you for reaching out to Nagar Care. We would like to confirm that your complaint has been successfully registered with us. Below are the details of your submission:

Complaint ID: ${complaintId}  
Name: ${name}  
Description: ${description}  
Location: ${location}  

Our team will review your complaint and take the necessary actions as soon as possible. If you require any additional information or have any questions, please do not hesitate to contact us at nagarcare@gmail.com.

Thank you for bringing this matter to our attention. We appreciate your patience and understanding as we work to resolve the issue.

Sincerely,  
The Nagar Care Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // Post complaint to Twitter (optional)
        // Prepare content for the tweet
        const tweetContent = `Complaint Registered: ${description} at ${location}`;
        twitter.post('statuses/update', { status: tweetContent }, (error, data, response) => {
            if (error) {
                console.error('Error posting to Twitter: ' + error);
            } else {
                console.log('Successfully posted to Twitter: ' + data.text);
            }
        });


        // Return success response
        res.json({ success: true, complaintId: complaintId });
        verifiedEmails.delete(email); // Optional: remove after use

    });

    stmt.finalize();
});

app.post('/send-email-otp', (req, res) => {
    const { email } = req.body;

    if (!email) return res.json({ success: false });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    emailOTPStore.set(email, otp);

    const mailOptions = {
        from: 'nagarcare@gmail.com',
        to: email,
        subject: 'Your NagarCare OTP',
        text: `Dear User,\n\nYour OTP for complaint submission is: ${otp}\n\nDo not share this with anyone.\n\nThanks,\nNagarCare Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending OTP email:', error);
            return res.json({ success: false });
        } else {
            return res.json({ success: true });
        }
    });
});

app.post('/verify-email-otp', (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = emailOTPStore.get(email);

    if (storedOtp === otp) {
        verifiedEmails.add(email);
        emailOTPStore.delete(email);
        return res.json({ verified: true });
    } else {
        return res.json({ verified: false });
    }
});



app.get('/getcomplaints', (req, res) => {
    db.all(`SELECT * FROM complaints`, (err, rows) => {
        if (err) {
            console.error('Error fetching complaints:', err.message);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(rows); // <--- send data as JSON
        }
    });
});




// Route to serve confirmation page
app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/confirmation.html'));
});

// Route to serve complaint page
app.get('/complaint', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/complaint.html'));
});

// Route to serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Export the app to use it in the server.js
module.exports = app;

// Start the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
