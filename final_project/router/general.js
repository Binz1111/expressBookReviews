const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  
  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  
  // Add new user to users array
  users.push({ username: username, password: password });
  
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if book exists
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  
  // Loop through all books and filter by author
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push({
        isbn: isbn,
        title: books[isbn].title,
        reviews: books[isbn].reviews
      });
    }
  }
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  
  // Loop through all books and filter by title
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push({
        isbn: isbn,
        author: books[isbn].author,
        reviews: books[isbn].reviews
      });
    }
  }
  
  if (booksByTitle.length > 0) {
    return res.status(200).json({ books: booksByTitle });
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if book exists
  if (books[isbn]) {
    const reviews = books[isbn].reviews || {};
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get all books using async callback function
public_users.get('/async', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
  
  getBooks.then((bookData) => {
    res.status(200).json(bookData);
  }).catch((error) => {
    res.status(500).json({ message: "Error fetching books" });
  });
});

// Task 11: Search by ISBN using async
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const getBookByISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 1000);
  });
  
  getBookByISBN.then((book) => {
    res.status(200).json(book);
  }).catch((error) => {
    res.status(404).json({ message: error });
  });
});

// Task 12: Search by Author using async
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      let booksByAuthor = [];
      for (let isbn in books) {
        if (books[isbn].author === author) {
          booksByAuthor.push({
            isbn: isbn,
            title: books[isbn].title,
            reviews: books[isbn].reviews
          });
        }
      }
      
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    }, 1000);
  });
  
  getBooksByAuthor.then((bookList) => {
    res.status(200).json({ books: bookList });
  }).catch((error) => {
    res.status(404).json({ message: error });
  });
});

// Task 13: Search by Title using async
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  
  const getBooksByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      let booksByTitle = [];
      for (let isbn in books) {
        if (books[isbn].title === title) {
          booksByTitle.push({
            isbn: isbn,
            author: books[isbn].author,
            reviews: books[isbn].reviews
          });
        }
      }
      
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    }, 1000);
  });
  
  getBooksByTitle.then((bookList) => {
    res.status(200).json({ books: bookList });
  }).catch((error) => {
    res.status(404).json({ message: error });
  });
});

module.exports.general = public_users;
