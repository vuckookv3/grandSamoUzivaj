const nodemailer = require('nodemailer');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');
const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    db: 1,
});
const RateLimitRedis = require('rate-limit-redis');
const slowDown = require('express-slow-down');
const { validationResult } = require('express-validator');
const upload = require('./multer');
const h = {};

const sessionMiddleware = session({
    store: new RedisStore({ client: redis }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
});

h.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json('Bad Request.');
    next();
}

h.aW = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next));
h.redis = redis;
h.sessionMiddleware = sessionMiddleware;

h.speedLimiter = slowDown({
    windowMs: 1 * 60 * 1000,
    delayAfter: 2,
    delayMs: 500,
    maxDelayMs: 10000,
    store: new RateLimitRedis({ client: redis }),
});

const DATE_START = new Date(process.env.DATE_START);
const DATE_END = new Date(process.env.DATE_END);
h.DATE_START = DATE_START;
h.DATE_END = DATE_END;

h.isStarted = (req, res, next) => {
    const now = new Date();

    if (req.headers.host === 'prelive.lasko.rs') return next();

    if (now < DATE_START) return res.redirect('/uskoro');
    else if (now > DATE_END) return res.redirect('/kraj');

    return next();
}

h.isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash('error', 'Molimo vas ulogujte se prvo.');
        return res.redirect('back');
    }
}

h.failedLogin = async (req, res, next) => {
    const key = `login:${req.ip}`;

    // write a failed attempt
    if (res === undefined && next === undefined) {
        await redis.multi().incr(key).expire(key, 60 * 60 * 1).exec();
        return;
    }

    // middleware
    const value = await redis.get(key);
    if (value) {
        const n = Number(value);
        if (n > 10) {
            const ttl = await redis.ttl(key);
            req.flash('error', `Imali ste previše neuspelih pokušaja. Pokušajte opet za: ${ttl} sekundi.`);
            return res.redirect('back');
        }
    }

    next();

}

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
    const a = await mailer.sendMail({
        from: 'Laško Kontakt <kontakt@lasko.rs>',
        to,
        subject,
        html,
    });

    return a;
}

h.mailer = sendMail;
h.upload = upload;

module.exports = h;
