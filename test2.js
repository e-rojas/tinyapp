const express = require('express');
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const uuid = require('uuid/v4');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

// app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    keys: ['e1d50c4f-538a-4682-89f4-c002f10a59c8', '2d310699-67d3-4b26-a3a4-1dbf2b67be5c'],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

const quotesDb = {
  'd9424e04-9df6-4b76-86cc-9069ca8ee4bb': {
    id: 'd9424e04-9df6-4b76-86cc-9069ca8ee4bb',
    quote: 'It’s not a bug. It’s an undocumented feature!',
  },
  '27b03e95-27d3-4ad1-9781-f4556c1dee3e': {
    id: '27b03e95-27d3-4ad1-9781-f4556c1dee3e',
    quote: 'Software Developer” – An organism that turns caffeine into software',
  },
  '5b2cdbcb-7b77-4b23-939f-5096300e1100': {
    id: '5b2cdbcb-7b77-4b23-939f-5096300e1100',
    quote:
   'If debugging is the process of removing software bugs, then programming must be the process of putting them in',
  },
  '917d445c-e8ae-4ed9-8609-4bf305de8ba8': {
    id: '917d445c-e8ae-4ed9-8609-4bf305de8ba8',
    quote: 'A user interface is like a joke. If you have to explain it, it’s not that good.',
  },
  '4ad11feb-a76a-42ae-a1c6-8e30dc12c3fe': {
    id: '4ad11feb-a76a-42ae-a1c6-8e30dc12c3fe',
    quote: 'If at first you don’t succeed; call it version 1.0',
  },
};

const quoteComments = {
  '70fcf8bd-6cb0-42f3-9887-77aa9db4f0ac': {
    id: '70fcf8bd-6cb0-42f3-9887-77aa9db4f0ac',
    comment: 'So awesome comment!',
    quoteId: 'd9424e04-9df6-4b76-86cc-9069ca8ee4bb',
  },
};

const usersDb = {
  eb849b1f: {
    id: 'eb849b1f',
    name: 'Kent Cook',
    email: 'really.kent.cook@kitchen.com',
    password: 'cookinglessons',
  },
  '1dc937ec': {
    id: '1dc937ec',
    name: 'Phil A. Mignon',
    email: 'good.philamignon@steak.com',
    password: 'meatlover',
  },
};

const quoteList = () => {
  const quotes = {};

  for (const quoteId in quotesDb) {
    quotes[quoteId] = quotesDb[quoteId];
    quotes[quoteId].comments = Object.keys(quoteComments)
      .filter(commentId => quoteComments[commentId].quoteId === quoteId)
      .map(commentId => quoteComments[commentId]);
  }
  return quotes;
};

const addUser = (name, email, password) => {
  // Generate a random id

  const userId = uuid().substr(0, 8);

  // Create a new user Object to store the user info
  // {
  //     id: 'eb849b1f',
  //     name: 'Kent Cook',
  //     email: 'really.kent.cook@kitchen.com',
  //     password: 'cookinglessons',
  //   }
  const newUser = {
    id: userId,
    name,
    email,
    password,
  };

  console.log(newUser);
  // Add new user object to usersDb

  usersDb[userId] = newUser;

  // return the userId

  return userId;
};

const findUser = email => {
  // for (const user of Object.values(usersDb)) {
  //   if (user.email === email) {
  //     return user;
  //   }
  // }
  // return false;

  return Object.values(usersDb).find(user => user.email === email);
};

const authenticateUser = (email, password) => {
  // Check if the user exist
  const user = findUser(email);

  // check if the passwords match
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  } else {
    return false;
  }
};

// ROUTES

app.get('/users', (req, res) => {
  res.json(usersDb);
});

app.get('/', (req, res) => res.redirect('/quotes'));

// display the registration form
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/users', (req, res) => {
  // extract the user information from the body of the request
  const { name, email, password } = req.body;
  // res.json(req.body);

  // Check that the user does not already exists in the users db
  // Add the user to the database
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const userId = addUser(name, email, hashPassword);

  // Set the cookie for that user

  // res.cookie('user_id', userId);
  req.session.user_id = userId;

  // redirecton to /quotes

  res.redirect('/quotes');
});

// Displaying the login form
app.get('/login', (req, res) => {
  res.render('login');
});

// Getting the post request from the form
app.post('/login', (req, res) => {
  // extract user info from body of the request
  const { email, password } = req.body;

  const user = authenticateUser(email, password);
  // if the user exists, check the password
  // if passwords match log the user => set the cookie
  if (user) {
    // res.cookie('user_id', user.id);
    req.session.user_id = user.id;
    // redirect to /quotes
    res.redirect('/quotes');
  } else {
    res.status(401).send('Wrong email or password');
  }
});

app.get('/quotes', (req, res) => {
  const quotes = Object.values(quoteList());

  res.render('quotes', { quotes });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));