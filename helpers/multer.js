const { join } = require('path');
const mime = require('mime-types');
const crypto = require('crypto');
const pathToUploads = join(__dirname, '..', 'public/uploads');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, pathToUploads);
    },
    filename: (req, file, cb) => {
        const extension = mime.extension(file.mimetype);
        if (!extension) return cb(new Error('Unsupported extension'));
        return cb(null, `${crypto.pseudoRandomBytes(32).toString('hex')}.${extension}`);
    }
});

const fileFilter = (req, file, cb) => {

    const fileTypes = /jpeg|jpg|png|mp4/;

    if (fileTypes.test(file.mimetype)) {
        return cb(null, true)
    } else {
        return cb(new Error('Unsupported file extension.'), false);
    }

}

const upload = (fieldName) => (req, res, next) => {
    const a = multer({ storage, fileFilter }).fields([{ name: 'picture', maxCount: 1 }, { name: 'video', maxCount: 1 }]);

    a(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(415).json({ status: 415, message: err, info: err });
        } else if (err) {
            return res.status(415).json({ status: 415, message: err.message || 'File problem' });
        }
        
        req.body = JSON.parse(JSON.stringify(req.body));
        return next();
    });
};

module.exports = upload;