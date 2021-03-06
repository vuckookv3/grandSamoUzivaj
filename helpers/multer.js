const { join } = require('path');
const mime = require('mime-types');
const crypto = require('crypto');
const pathToUploads = join(__dirname, '..', 'public/uploads');
const multer = require('multer');
mime.types['mov'] = 'video/mp4';
mime.extensions['video/quicktime'] = ['mov'];
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         return cb(null, pathToUploads);
//     },
//     filename: (req, file, cb) => {
//         let extension = mime.extension(file.mimetype);
//         if (extension === 'qt') extension = 'mov';
//         if (!extension) return cb(new Error('Unsupported extension'));
//         return cb(null, `${crypto.pseudoRandomBytes(32).toString('hex')}.${extension}`);
//     }
// });
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const fileTypes = /jpeg|jpg|png|mp4|webm|mov/;
    if (fileTypes.test(mime.extension(file.mimetype))) {
        return cb(null, true);
    } else {
        return cb(new Error('Unsupported file extension.'), false);
    }

}

const upload = (fieldName) => (req, res, next) => {
    const a = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 200 } }).fields([{ name: 'picture', maxCount: 1 }, { name: 'video', maxCount: 1 }]);

    a(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            let message = 'Doslo je do greske prilikom slanja. Pokusajte ponovo';
            if (err.code === 'LIMIT_FILE_SIZE') {
                message = 'Limit file-ova je 200MB. Molim vas posaljite manji file.';
            }
            req.flash('error', message);
            return res.redirect('/profil');
        } else if (err) {
            req.flash('error', 'Nepodrzan format file-a');
            return res.redirect('/profil');
        }

        req.body = JSON.parse(JSON.stringify(req.body));
        return next();
    });
};

module.exports = upload;