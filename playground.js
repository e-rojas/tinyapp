data = [
  { shortURL: "b2xVn2", longURL: "http://www.lighthouselabs.ca" },
  { shortURL: "9sm5xK", longURL: "http://www.google.com" },
  { shortURL: "kspj3b", longURL: "http://www.amazon.com" },
  { shortURL: "ig4nol", longURL: "http://www.nike.com" },
  { shortURL: "hpuc6o", longURL: "http://www.ford.com" },
  { shortURL: "o0d54s", longURL: "http://www.redken.com" },
  { shortURL: "okczha", longURL: "http://www.matrix.com" }
];

const findLongURL = function(arr, shortURL) {
  for (const obj of arr) {
    if (obj.shortURL === shortURL) {
      return obj.longURL;
    }
  }
};

const find = function(arr,shortUrL){
   return arr.forEach(obj => {
        obj.shortURL === shortURL
    });
}
console.log(findLongURL(data,'okczha'));