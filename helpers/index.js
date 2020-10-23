const nodemailer = require('nodemailer');
const session = require('express-session');
const crypto = require('crypto');
const mime = require('mime-types');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');
const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    db: 3,
});
const RateLimitRedis = require('rate-limit-redis');
const slowDown = require('express-slow-down');
const { validationResult } = require('express-validator');
const upload = require('./multer');
const mailer = require('./mailer');
const { s3Upload, s3Delete } = require('./aws');
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

    if (req.headers.host === 'prelive.samouzivaj.rs') return next();
    if (now < DATE_START) return res.redirect('/uskoro');
    else if (now > DATE_END) return res.redirect('/kraj');

    return next();
}

h.mailer = mailer;
h.upload = upload;
h.s3Upload = s3Upload;
h.s3Delete = s3Delete;

h.filename = (file) => {
    let extension = mime.extension(file.mimetype);
    if (extension === 'qt') extension = 'mov';
    if (!extension) throw new Error('Unsupported extension');
    return `${crypto.pseudoRandomBytes(32).toString('hex')}.${extension}`;
}

h.imageExtensions = /jpeg|jpg|png/;
h.videoExtensions = /mp4|webm|mkv|mov|avi|qt/;

module.exports = h;
