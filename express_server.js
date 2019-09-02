const express = require("express");
const app = express();
const PORT = 4000; //default port
app.set("view engine", "ejs");
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/urls", (request, response) => {
  let templateVaars = { urls: urlDatabase };
  response.render("urls_index", templateVaars);
});
app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});
app.get("/urls/:shortURL", (request, response) => {
  console.log(request.params.shortURL);
  let templateVars = {
    shortURL: request.params.shortURL,
    longURL: urlDatabase[request.params.shortURL]
  };
  response.render("urls_show", templateVars);
});
app.post("/urls", (request, response) => {
  console.log(request.body); //// Log the POST request body to the console
  response.send("OK"); // Respond with 'Ok' (we will replace this)
});

const generateRandomString = ()=>{
   return Math.random().toString(36).slice(7)
}
console.log(generateRandomString())

app.listen(PORT, () => {
  console.log(`Listening on port:${PORT}`);
});
