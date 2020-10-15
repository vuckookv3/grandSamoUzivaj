const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
        user: 'kontakt@lasko.rs',
        pass: 'COaPgBuTqG',
    }
});

const sendMail = async (to, subject, html) => {
    const info = await mailer.sendMail({
        from: 'Laško Kontakt <kontakt@lasko.rs>',
        to,
        subject,
        html,
    });

    return info;
}
module.exports = sendMail;