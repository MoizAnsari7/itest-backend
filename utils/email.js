// utils/email.js
const nodemailer = require('nodemailer');

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any SMTP service here
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password
    },
});

const sendTestInvitationEmail = async (toEmail, passkey) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // sender address
        to: toEmail, // list of receivers
        subject: 'Test Invitation', // Subject line
        html: `<p>You have been invited to take a test. Please use the following passkey to start the test:</p>
               <p><strong>Passkey: ${passkey}</strong></p>
               <p>The test will be available from the moment you receive this email until the validity period expires.</p>`, // HTML body
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email: ', error);
        throw new Error('Error sending email');
    }
};

module.exports = { sendTestInvitationEmail };
