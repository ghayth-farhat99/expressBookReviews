const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.query.username;
    const password = req.query.password;
    if(!username){return res.status(403).json({message:"username is not provided."})};
    if(!password){return res.status(403).json({message:"password is not provided."})};
    
    let user = users.filter((user) => user.username == username);
    if(!user.length >0){
        return res.status(404).json({message: "User does not exist"})
    }else{
        if(user[0].password != password){return res.status(401).json({message: "Wrong password"})};
    }
    let accessToken = jwt.sign({data:user},'access',{expiresIn: 60*60});
    req.session.authorization = {accessToken};
    return res.status(200).json({message: "User successfully logged in"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;
    let reviews = books[isbn].reviews;
    const user = req.user;
    const username = user.data[0].username;
    if(reviews[username]){
        reviews[username] = review;
        return res.status(200).json({message: "Review successfully updated"})
    }
    reviews = {...reviews, [username]: review};
    books[isbn].reviews = reviews;
    return res.status(200).json({message: "Review successfully added"});
});

//deleting a book review under
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviews = books[isbn].reviews;
    const user = req.user;
    const username = user.data[0].username;
    if(reviews[username]){
        delete reviews[username];
        return res.status(200).json({message: "Review successfully deleted"});
    }
    return res.status(404).json({message: "You dont have a review for this book"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
