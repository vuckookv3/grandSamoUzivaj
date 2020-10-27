const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const { isEmail, isMongoId } = require('validator');
const { Entry } = require('../models');
const { isStarted, DATE_START, upload, imageExtensions, videoExtensions, filename, s3Upload } = require('../helpers');

router.get('/uskoro', (req, res) => {
    // if (Date.now() > DATE_START) return res.redirect('/');
    res.render('uskoro');
});

router.get('/kraj', (req, res) => {
    res.render('kraj');
});

router.use(isStarted);

router.get('/', (req, res) => {
    if (req.session.entry) {
        return res.redirect('/profil');
    }
    res.render('pocetna');
});

router.get('/profil', async (req, res) => {
    if (!req.session.entry) {
        // req.flash('error', 'Unesite vase podatke prvo');
        return res.redirect('/');
    }

    const entry = await Entry.findById(req.session.entry).exec();
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

router.get('/prijave', async (req, res) => {
    let page = req.query.page ? Number(req.query.page) : 1;
    if (isNaN(page) || page <= 0) page = 1;
    const skip = (page - 1) * 20;
    const prijave = await Entry.find({ status: { $in: ['AUTHORIZED', 'WINNER'] } }).sort('-_id').skip(skip).limit(20).exec();
    res.render('prijave', { prijave, page });
});

router.get('/prijave/:id', async (req, res) => {
    if (!isMongoId(req.params.id)) return res.redirect('/');

    const prijava = await Entry.findById(req.params.id).exec();
    if (!prijava) return res.redirect('/');

    let type = '';
    if (prijava.video) {
        type = path.extname(prijava.video);
        type = mime.lookup(type);
        if (type === 'video/quicktime') type = 'video/mp4';
    }

    if (req.session.admin) {
        return res.render('prijava', { prijava, type });
    }
    if (prijava.status === 'UNAUTHORIZED' || prijava.status === 'DENIED') return res.redirect('/');

    res.render('prijava', { prijava, type });
});

// router.get('/prijave/:id', (req, res) => {
//     res.render('prijava');
// });
router.get('/pravila', (req, res) => {
    res.render('pravila');
});

router.get('/dobitnici', async (req, res) => {
    const dobitnici = await Entry.find({ status: 'WINNER' }).sort('winnerPhase winnerPrize').exec();
    res.render('dobitnici', { dobitnici });
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

    // let shouldDeleteFiles = false;

    if (req.files.picture && req.files.picture[0]) {
        if (!imageExtensions.test(mime.extension(req.files.picture[0].mimetype))) {
            shouldDeleteFiles = true;
        }
        try {
            const file = await s3Upload(filename(req.files.picture[0]), req.files.picture[0]);
            entry.picture = file.Key;
            entry.pictureDescription = req.body.pictureDescription;
        } catch (err) {
            req.flash('error', 'Doslo je do greske prilikom uploada');
            return res.redirect('/profil');
        }
    }

    if (req.files.video && req.files.video[0]) {
        if (!videoExtensions.test(mime.extension(req.files.video[0].mimetype))) {
            shouldDeleteFiles = true;
        }
        try {
            const file = await s3Upload(filename(req.files.video[0]), req.files.video[0]);
            entry.video = file.Key;
            entry.videoDescription = req.body.videoDescription;
        } catch (err) {
            req.flash('error', 'Doslo je do greske prilikom uploada');
            return res.redirect('/profil');
        }
    }

    // if (shouldDeleteFiles) {
    //     if (req.files.picture && req.files.picture[0]) {
    //         fs.unlinkSync(req.files.picture[0].path);
    //     }
    //     if (req.files.video && req.files.video[0]) {
    //         fs.unlinkSync(req.files.video[0].path);
    //     }
    //     req.flash('error', 'Nepodrzan file');
    //     return res.redirect('/profil');
    // }

    entry.submitted = true;

    try {
        await entry.save();
    } catch (err) {
        req.flash('error', 'Doslo je do greske, pokusajte ponovo');
        return res.redirect('/profil');
    }

    delete req.session.entry;

    // req.flash('success', 'Vasa prijava je uspesna');
    res.redirect('/?modalUspesno=1');
});

module.exports = router;