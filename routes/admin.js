const express = require('express');
const router = express.Router();
const admins = require('../admins.json');
const { redis, mailer } = require('../helpers');
const { Entry } = require('../models');
const path = require('path');
const fs = require('fs');

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
    const prijave = await Entry.find().sort('-_id').lean().exec();
    res.render('admin/index', { prijave });
});

const emailAuthorized = fs.readFileSync(path.join(__dirname, '..', './views/partials/emailWinner.ejs'), 'utf-8');
const emailDenied = fs.readFileSync(path.join(__dirname, '..', './views/partials/emailUnauthorized.ejs'), 'utf-8');

router.post('/api/prijave/:id/status/winner', async (req, res) => {
    const entry = await Entry.findById(req.params.id).exec();
    if (!entry) {
        req.flash('error', 'Prijava nije pronadjena');
        return res.redirect('/admin');
    }

    entry.status = 'WINNER';
    entry.winnerPhase = Number(req.body.winnerPhase);
    entry.winnerPrize = Number(req.body.winnerPrize);
    await entry.save();

    req.flash('success', 'Uspesno ste izabrali pobednika');
    res.redirect('/admin');
});

router.put('/api/prijave/:id/status', async (req, res) => {
    const status = req.body.status;
    if (!status) return res.status(400).json({});

    if (!['UNAUTHORIZED', 'DENIED', 'AUTHORIZED', 'WINNER'].includes(status)) return res.status(400).json({});

    const entry = await Entry.findById(req.params.id).exec();
    if (!entry) return res.status(404).json({});

    entry.status = status;
    const isModified = entry.isModified('status');
    await entry.save();

    let html = null;

    if (entry.status === 'DENIED') {
        html = emailDenied;
    }
    else if (entry.status === 'AUTHORIZED') {
        html = emailAuthorized;
    }
    else {

    }

    try {
        if (isModified && ['DENIED', 'AUTHORIZED'].includes(entry.status) && !!html) {
            // const mail = await mailer(entry.email, 'Status vase prijave', html);
        }
    } catch (err) {
        console.error('MAIL NOT SENT:')
        console.error(err);
        console.error('=====================');
    }

    res.json('OK')
});

router.post('/prijave/:id/delete', async (req, res) => {
    const entry = await Entry.findById(req.params.id).exec();
    if (!entry) {
        req.flash('error', 'Prijava nije pronadjena');
        return res.redirect('/admin');
    }

    await entry.remove();
    req.flash('success', 'Prijava uspesno obrisana');
    res.redirect('/admin');
});

// router.post('/api/prijave', async (req, res) => {
//     // const sort = req.body.order[0].dir === 'desc' ? '-_id' : '_id';
//     const sort = '-_id';
//     const skip = Number(req.body.start);
//     const limit = Number(req.body.length);

//     const query = { submitted: true };

//     const [data, recordsTotal, recordsFiltered] = await Promise.all([
//         Entry.find(query).sort(sort).skip(skip).limit(limit).lean().exec(),
//         Entry.estimatedDocumentCount(),
//         Entry.countDocuments(query),
//     ]);

//     res.json({
//         draw: Number(req.body.draw),
//         data,
//         recordsTotal,
//         recordsFiltered,
//     });
// });

module.exports = router;