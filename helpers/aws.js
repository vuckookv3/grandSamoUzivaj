const AWS = require('aws-sdk');

const s3bucket = new AWS.S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    bucket: process.env.BUCKET_NAME,
    endpoint: 'https://fra1.digitaloceanspaces.com',
});

const s3Upload = (key, file) => new Promise((resolve, reject) => {
    const params = {
        Bucket: 'samouzivaj',
        Key: key,
        ACL: 'public-read',
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    s3bucket.upload(params, (err, data) => {
        if (err) return reject(err);
        resolve(data);
    });
});

const s3Delete = (key) => new Promise((resolve, reject) => {
    const params = {
        Bucket: 'samouzivaj',
        Key: key,
    };
    s3bucket.deleteObject(params, (err, data) => {
        if (err) return reject(err);
        resolve(data);
    });
});

module.exports = { s3Upload, s3Delete };