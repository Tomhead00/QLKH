const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 465,
            secure: true,
            // requireTLS: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log('email sent sucessfully');
    } catch (error) {
        console.log(error, 'email not sent');
        // console.log(process.env.USER, process.env.PASS);
    }
};

module.exports = sendEmail;
