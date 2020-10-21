const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
        user: 'no-reply@samouzivaj.rs',
        pass: 'V0cO6K3Qnm',
    }
});

const sendMail = async (to, subject, html) => {
    const info = await mailer.sendMail({
        from: 'NoReply Grand Kafa <no-reply@samouzivaj.rs>',
        to,
        subject,
        html,
    });

    return info;
}
module.exports = sendMail;