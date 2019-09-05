const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const uuid = require("uuid/v4");
const cookieSession = require("cookie-session");
const PORT = 4000; //default port

app.use(cookieParser());
//Functions
//Adduser to DB
const addUser = (email, password) => {
  //create arandom user ID
  const userID = uuid().substr(0, 8);
  //Create an object of the user
  const newUser = {
    id: userID,
    email,
    password
  };
  //add new user to the userDB
  usersDB[userID] = newUser;

  return userID;
};
//USER AUTHENTICATION
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
//FIND USER
const findUser = email => {
  return Object.values(usersDB).find(user => user.email === email);
};
//-----------

app.set("view engine", "ejs");
//Database
const usersDB = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "tammy@gmail.com",
    password: "1234"
  }
  //------------
};
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//Login user
app.get('/login',(req,res)=>{
  let templateVars = {user: usersDB[req.cookies.user_id]}
res.render('login',templateVars)
})
//Authentica login user
app.post('/login',(req,res)=>{
  const user = authenticateUser(email,password)
  if (user) {
     res.cookie('user_id', user.id);
    //req.session.user_id = user.id;
    // redirect to /quotes
    res.redirect('/urls');
  } else {
    res.status(403).send('Email cannot be found');
  }
})//logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  return res.status(200).redirect('/login');
  //res.clearCookies("user_id");
  //console.log('user cookie',req.cookies)
  //res.redirect("/urls");
});
//Register new user
app.get("/register", (req, res) => {
  let templateVars = {user: usersDB[req.cookies.user_id]}
  res.render("register",templateVars);
});

//Register POST handler
app.post("/register", (req, res) => {
  //create const for email password
  const { email, password } = req.body;
  if (authenticateUser(email)) {
    res.status(403).send("Email already in database");
    console.log(email);
  } else {
    //bcryting the passwords with salt
    const salt = bcrypt.genSaltSync(10);

    //hashed password
    const hashedPassword = bcrypt.hashSync(password, salt);

    //user const with email and hashed password
    const user = addUser(email, hashedPassword);

    //set the user to a cookie
    res.cookie("user_id", user);
    

    console.log(usersDB[user]);
    let templateVars = usersDB[user];
    res.redirect("urls");
  }
});
//Get usersJSON
app.get("/users", (req, res) => {
  res.json(usersDB);
});
app.get("/urls", (req, res) => {
  let templateVaars = { urls: urlDatabase, user: usersDB[req.cookies.user_id] };
  /* console.log(usersDB);
  console.log(req.cookies);
  console.log(usersDB[req.cookies]); */
  // let templateVaars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVaars);
});
app.get("/urls/new", (req, res) => {
  let templateVaars = { urls: urlDatabase, user: usersDB[req.cookies.user_id] };
  
  if(!req.cookies.user_id){
    res.redirect('/login')
  }
  res.render("urls_new",templateVaars);
});
app.get("/urls/:shortURL", (req, res) => {
  console.log(req.params.shortURL);
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  console.log(req.body.longURL); //// Log the POST req body to the console
  res.send("OK"); // Respond with 'Ok' (we will replace this)
});
//Updating short urls
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});
//Deleting short urls
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
//User Login
/* app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
  console.log("Username:", req.body.username);
  console.log("Cookies: ", req.cookies);
}); */


const generateRandomString = () => {
  return Math.random()
    .toString(36)
    .substring(7);
};
// console.log(generateRandomString())

app.listen(PORT, () => {
  console.log(`Listening on port:${PORT}`);
});
