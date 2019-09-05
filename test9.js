const getUserByEmail = (email,db)=>{
    return Object.values(db).find(user => user.email === email).id;
}

const testUsers = {
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
  };
 console.log( getUserByEmail("user@example.com",testUsers))