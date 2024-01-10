const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  let validation = isValid(username);
  let user = users.filter((user) => user.username == username);

  if(!username){
    return res.status(404).json({message:"username is not provided."});
  }
  if(!password){
    return res.status(404).json({message:"password is not provided."});
  }
  if(!validation){
    return res.status(403).json({message:"Username is not valide"})
  }
  if(user.length > 0){
    return res.status(409).json({message:"User already exists"})
  }
  users.push({'username':username,'password':password});
  return res.status(200).json({message:"User seccessfully created"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// getBooks function that returns a promise 
function getBooks(){
    return new Promise((resolve,reject) => {
        if(books){return resolve(books)}
        else{ return reject('No found books')};
    })
}
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getBooks().then(books => {
      return res.send(JSON.stringify(books));
    }).catch(err => {
      console.error(err);
      return res.status(500).json({message: "An error occurred"});
    });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getBooks().then(books => {
    return res.send(JSON.stringify(books[isbn]));
  }).catch(err => {
    console.error(err);
    return res.status(500).json({message: "An error occurred"});
  });
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  getBooks().then(books => {
      let book = Object.values(books).filter((book) => book.author == author);
      return res.send(JSON.stringify(book));
  }).catch(err => {
    console.error(err);
    return res.status(500).json({message: "An error occurred"});
  });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  getBooks().then(books => {
    let book = Object.values(books).filter((book) => book.title == title);
    return res.send(JSON.stringify(book));
  }).catch(err => {
    console.error(err);
    return res.status(500).json({message: "An error occurred"});
  });
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews))
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

