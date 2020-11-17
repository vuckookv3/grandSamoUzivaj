const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@samouzivaj.rs',
        pass: 'V0cO6K3Qnm',
    }
});

const sendMail = async (to, subject, html) => {
    const info = await mailer.sendMail({
        from: 'Samo Uživaj Konkurs <noreply@samouzivaj.rs>',
        to,
        subject,
        html,
    });

    return info;
}
module.exports = sendMail;