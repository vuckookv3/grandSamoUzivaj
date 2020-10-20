const router = require('express').Router();
const fs = require('fs');
const mime = require('mime-types');
const { isEmail } = require('validator');
const { Entry } = require('../models');
const { isStarted, DATE_START, upload, imageExtensions, videoExtensions } = require('../helpers');

router.get('/uskoro', (req, res) => {
    // if (Date.now() > DATE_START) return res.redirect('/');
    res.render('uskoro');
});

router.get('/kraj', (req, res) => {
    res.render('kraj');
});

router.use(isStarted);

router.get('/', (req, res) => {
    res.render('pocetna');
});

router.get('/profil', async (req, res) => {
    if (!req.session.entry) {
        req.flash('error', 'Unesite vase podatke prvo');
        return res.redirect('/');
    }

    const entry = await Entry.findById(req.session.entry);
    if (!entry) {
        req.flash('error', 'Prijava nije pronadjena. Pokusajte ponovo');
        return res.redirect('/');
    }

    if (entry.submitted) {
        req.flash('error', 'Prijava nije pronadjena. Pokusajte ponovo');
        return res.redirect('/');
    }

    res.render('profil');
});

router.get('/prijave', (req, res) => {
    res.render('prijave');
});

router.get('/pravila', (req, res) => {
    res.render('pravila');
});

router.get('/dobitnici', (req, res) => {
    res.render('dobitnici');
});

router.get('/mehanizam', (req, res) => {
    res.render('mehanizam');
});

router.get('/nagrade', (req, res) => {
    res.render('nagrade');
});

router.get('/kontakt', (req, res) => {
    res.render('kontakt');
});

router.post('/prijava/1', async (req, res) => {
    const { name, email, biCode } = req.body;

    if (!name || !email || !biCode) {
        req.flash('error', 'Niste uneli sve podatke');
        return res.redirect('/');
    }

    if (!isEmail(email)) {
        req.flash('error', 'Email neispravan');
        return res.redirect('/');
    }

    const entry = new Entry({
        name,
        email,
        biCode,
    });

    try {
        await entry.save();
    } catch (err) {
        req.flash('error', 'BI broj je vec iskoriscen');
        return res.redirect('/');
    }

    req.session.entry = entry._id;

    res.redirect('/profil');

});

router.post('/prijava/2', upload(), async (req, res) => {

    if (!req.session.entry) {
        req.flash('error', 'Prvo popunite podatke');
        return res.redirect('/');
    }

    if (!req.files) {
        req.flash('error', 'Morate poslati file');
        return res.redirect('/profil');
    }

    if (!req.files.picture && !req.files.video) {
        req.flash('error', 'Morate poslati file');
        console.log('OVDE')
        return res.redirect('/profil');
    }

    const entry = await Entry.findById(req.session.entry);

    if (!entry) {
        req.flash('error', 'Prijava ne postoji');
        return res.redirect('/');
    }

    if (entry.submitted) {
        req.flash('error', 'Vec ste predali prijavu za ovaj broj');
        return res.redirect('/');
    }

    let shouldDeleteFiles = false;

    if (req.files.picture && req.files.picture[0]) {
        if (!imageExtensions.test(mime.extension(req.files.picture[0].mimetype))) {
            shouldDeleteFiles = true;
        }
        entry.picture = req.files.picture[0].filename;
        entry.pictureDescription = req.body.pictureDescription;
    }

    if (req.files.video && req.files.video[0]) {
        if (!videoExtensions.test(mime.extension(req.files.video[0].mimetype))) {
            shouldDeleteFiles = true;
        }
        entry.video = req.files.video[0].filename;
        entry.videoDescription = req.body.videoDescription;
    }

    if (shouldDeleteFiles) {
        if (req.files.picture && req.files.picture[0]) {
            fs.unlinkSync(req.files.picture[0].path);
        }
        if (req.files.video && req.files.video[0]) {
            fs.unlinkSync(req.files.video[0].path);
        }
        req.flash('error', 'Nepodrzan file');
        return res.redirect('/profil');
    }

    entry.submitted = true;

    try {
        await entry.save();
    } catch (err) {
        req.flash('error', 'Doslo je do greske, pokusajte ponovo');
        return res.redirect('/profil');
    }

    delete req.session.entry;

    req.flash('success', 'Vasa prijava je uspesna');
    res.redirect('/');
});

module.exports = router;