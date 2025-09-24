import path from 'path';
import express from 'express';
import session from 'express-session';
import compression from 'compression';
import methodOverride from 'method-override';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './node/routes/index.js';
import ejsMate from 'ejs-mate';

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

const __dirname = path.resolve();
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'node/views'));
app.set('view engine', 'ejs');

app.use('/install', express.static(path.join(__dirname, 'src/Packs')));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.routeIs = (name) => app.locals.currentRouteName === name;

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.old = (key, fallback = '') => (req.session._old && req.session._old[key]) || fallback;
  res.locals.errors = req.session._errors || {};
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

