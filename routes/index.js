const router = require('express').Router();
const { isStarted, DATE_START, upload } = require('../helpers');

router.get('/uskoro', (req, res) => {
    if (Date.now() > DATE_START) return res.redirect('/');
    res.render('uskoro');
});

router.get('/kraj', (req, res) => {
    res.render('kraj');
});

router.use(isStarted);

router.get('/', (req, res) => {
    res.render('pocetna');
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


router.post('/prijava', upload(), async (req, res) => {

});

module.exports = router;