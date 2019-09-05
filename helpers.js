const uuid = require("uuid/v4");
const bcrypt = require("bcrypt");
const usersDB = {};
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
  console.log("user", user);
  console.log("password", password);
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

//Database find of user

const filterUser = (userID, database) => {
  const userLinks = {};
  for (const key of Object.keys(database)) {
    if (userID === database[key].userID) {
      userLinks[key] = database[key];
    }
  }
  return userLinks;
};

module.exports = {
  addUser,
  authenticateUser,
  findUser,
  usersDB,
  filterUser
};
