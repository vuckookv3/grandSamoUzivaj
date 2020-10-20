const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const { sessionMiddleware } = require('./helpers');

const app = express();

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('trust proxy', true);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
