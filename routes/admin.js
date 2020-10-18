const express = require('express');
const router = express.Router();
const admins = require('../admins.json');
const { redis } = require('../helpers');

const isAdmin = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next();
    } else {
        req.flash('error', 'Molimo vas ulogujte se prvo.');
        return res.redirect('/admin/login');
    }
}

const failedAttempts = async (req, res, next) => {

    const key = `admin:${req.ip}`;
    const value = await redis.get(key);

    if (value) {
        const numb = Number(value);
        if (numb > 5) {
            const ttl = await redis.ttl(key);
            return res.status(429).send(`Too many failed login attempts. Please wait before trying again.\nTime to wait: ${ttl}s`);
        }
    }

    next();
}


router.get('/login', failedAttempts, async (req, res) => {
    res.render('admin/login');
});

router.post('/login', failedAttempts, async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) return res.redirect('/admin/login');

    const admin = admins.find(e => e.username === username && e.password === password);

    if (!admin) {
        await redis.multi().incr(`admin:${req.ip}`).expire(`admin:${req.ip}`, 60 * 60 * 1).exec();
        return res.redirect('/admin/login');
    }

    req.session.admin = admin;
    res.redirect('/admin');

});

router.use(isAdmin);

router.post('/logout', async (req, res) => {
    delete req.session.admin;
    await req.session.save();
    res.redirect('/admin/login');
});

router.get('/', async (req, res) => {
    res.render('admin/index');
});

module.exports = router;