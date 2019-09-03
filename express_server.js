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

app.get("/urls", (req, res) => {
  let templateVaars = { urls: urlDatabase };
  res.render("urls_index", templateVaars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
    urlDatabase[generateRandomString()]= req.body.longURL
  console.log(req.body.longURL); //// Log the POST req body to the console
  res.send("OK"); // Respond with 'Ok' (we will replace this)
});
//Updating short urls
app.post('/urls/:id',(req,res)=>{
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect('/urls')
console.log(req.body)
console.log(req.params)
})
//Deleting short urls
app.post('/urls/:shortURL/delete',(req,res)=>{
delete urlDatabase[req.params.shortURL]
res.redirect('/urls')
})
const generateRandomString = ()=>{
   return Math.random().toString(36).substring(7)
}
// console.log(generateRandomString())

app.listen(PORT, () => {
  console.log(`Listening on port:${PORT}`);
});
