var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer'); 
const sgMail = require('@sendgrid/mail');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.in',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'noreply@datagateway.in',
    pass: 'Apple7620@'
  }
});
// In-memory storage for subscriptions (for simplicity)
let subscriptions = [];

// Route to handle subscriptions
router.post('/subscribe', (req, res) => {
  const email = req.body.email;

  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }

  // Basic email validation (for more robust validation, consider using a library like validator)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
  }

  subscriptions.push(email);
  console.log(`New subscription: ${email}`);

  // Send a thank you email
  const mailOptions = {
      from: 'noreply@datagateway.in',
      to: email,
      subject: 'Thank you for subscribing',
      text: 'Thank you for subscribing to our service!'
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error(`Error sending email to ${email}:`, error);
          return res.status(500).json({ message: 'Failed to send email' });
      }
      console.log(`Email sent to ${email}: ${info.response}`);
      return res.status(200).json({ message: 'Thank you for subscribing' });
  });
})


module.exports = router;
