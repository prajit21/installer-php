const path = require('path');
const express = require('express');
const session = require('express-session');
const compression = require('compression');
const methodOverride = require('method-override');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./node/routes/index.js');
const ejsMate = require('ejs-mate');

dotenv.config();

const app = express();

app.set('trust proxy', 1);
app.use(compression());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true }
  })
);

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'node/views'));
app.set('view engine', 'ejs');

app.use('/install', express.static(path.join(__dirname, 'src/Packs')));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.routeIs = (name) => app.locals.currentRouteName === name;

app.use((req, res, next) => {
  const oldSnapshot = Object.assign({}, req.session._old || {});
  const errorsSnapshot = Object.assign({}, req.session._errors || {});
  res.locals.session = req.session;
  res.locals.errors = errorsSnapshot;
  res.locals.old = (key, fallback = '') => {
    if (!key) return fallback;
    const parts = key.split('.');
    let cur = oldSnapshot;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return fallback;
      }
    }
    return cur ?? fallback;
  };
  req.session._old = {};
  req.session._errors = {};
  next();
});

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

