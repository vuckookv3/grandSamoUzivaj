const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const { sessionMiddleware, browserDetect } = require('./helpers');

const app = express();

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('trust proxy', true);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'", "https://www.googletagmanager.com/", "https://www.google-analytics.com"],
      'base-uri': ["'self'"],
      'block-all-mixed-content': [],
      'font-src': ["'self'", "https:", "data:"],
      'frame-ancestors': ["'self'"],
      'img-src': ["'self'", "data:", `${process.env.S3_BUCKET}`, "https://www.facebook.com", "https://googleads.g.doubleclick.net/", "https://www.google.com"],
      'media-src': ["'self'", `${process.env.S3_BUCKET}`],
      'object-src': ["'none'"],
      'script-src': ["'self'", "https://www.googletagmanager.com/", "'sha256-TJ41JiFkGthN+ngzi4GrtMzDYG+n8M05wh6uDpJw2UE='", "https://connect.facebook.net/", "'sha256-VquuBVF/YgtQj5mFTTg8rWvI7paqO2n9oISJXWfvq4Y='", "'sha256-11DMmm4PPncWoHY/h28I+Uq6zCpxbgqSl87iovVHY3Y='", "'sha256-b01/0Z2rxWvZNQqBm6LTSNl4btbXS1vQnec9dJZ4FZY='", "https://www.googleadservices.com/"],
      'script-src-attr': ["'none'"],
      'style-src': ["'self'", "https:", "'unsafe-inline'"],
      'upgrade-insecure-requests': []
    }
  }
}));
app.use(express.json({ limit: '202mb' }));
app.use(express.urlencoded({ extended: true, limit: '202mb' }));
app.use(cookieParser());
app.use(cors());

// STATICS
app.use(express.static(path.join(__dirname, 'public')));

// SESSION
app.use(sessionMiddleware);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  next();
});
app.use(browserDetect());

// ROUTES
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  return res.status(404).send('');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
