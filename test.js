const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const uuid = require("uuid/v4");
const cookieSession = require("cookie-session");
const PORT = 4000; //default port

app.use(cookieParser());

app.set("view engine", "ejs");
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//USERS DATABASE
const usersDB = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//------------------------------------------
//FUNCTIONS
//Add User
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
//Find user
const findUser = email => {
  /* for (const user of Object.values(usersDB)) {
      if(user.email === email){
        return user 
      }
      return false
  } */
  return Object.values(usersDB).find(user => user.email === email);
};
const authenticate = (email,password)=>{
  const user = findUser(email)
  //check if password match 
  if(user && bcrypt.compareSync(password,user.password)){
    return user
  }else {
    return false
  }
}
//------------- ROUTES

//User Registration display Registration form
app.get("/register", (req, res) => {
  let templateVars = {user: usersDB[req.cookies["user_id"]]}
  console.log(templateVars)
  res.render("register",templateVars);
});
app.get("/users", (req, res) => {
  res.json(usersDB);
});
app.post("/register", (req, res) => {
  //create const for email password
  const { email, password } = req.body;
  //before you add user check if user does not exist
  const findUserResponse = findUser(email);
  //console.log(findUserResponse.email);
  if (findUserResponse) {
    res.status(400).send("Email already in databse");
  }

  //bcryting the passwords with salt
  const salt = bcrypt.genSaltSync(10);

  //hashed password
  const hashedPassword = bcrypt.hashSync(password, salt);

  //user const with email and hashed password
  const user = addUser(email, hashedPassword);

  //set the user to a cookie
  res.cookie("user_id", user);
  // req.session.user_id = user

  //user id returned to use with cookie

  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVaars = { urls: urlDatabase, user: usersDB[req.cookies["user_id"]] };
  console.log(templateVaars)
  res.render("urls_index", templateVaars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  //console.log(req.body.longURL); //// Log the POST req body to the console
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
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
  //console.log('Username:',req.body.username)
  //console.log('Cookies: ', req.cookies)
});
//User logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

const generateRandomString = () => {
  return Math.random()
    .toString(36)
    .substring(7);
};
// console.log(generateRandomString())

app.listen(PORT, () => {
  console.log(`Listening on port:${PORT}`);
});
