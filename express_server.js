const express = require('express')
const app = express()
const PORT = 4000      //default port
app.set('view engine','ejs')
const urlDatabase ={
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"  
}

app.get('/urls',(request,response)=>{
    let templateVaars = {urls:urlDatabase}
    response.render('urls_index',templateVaars)
})
app.get('/urls/:shortURL',(request,response)=>{
    console.log(request.params.shortURL)
let templateVars = {shortURL: request.params.shortURL, longURL:urlDatabase[request.params.shortURL]}
console.log(templateVars)
response.render('urls_show',templateVars)
})


app.listen(PORT,()=>{
    console.log(`Listening on port:${PORT}`)
})