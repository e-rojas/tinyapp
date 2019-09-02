const express = require('express')
const app = express()
const PORT = 4000      //default port

const urlDatabases ={
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"  
}
app.get('/',(request,response)=>{
    response.send('Hello')
})

app.listen(PORT,()=>{
    console.log(`Listening on port:${PORT}`)
})