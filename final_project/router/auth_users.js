const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if username exists in the users array
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  // Find user with matching username and password
  const user = users.find(user => 
    user.username === username && user.password === password
  );
  return user !== undefined;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  
  // Check if user exists and credentials are correct
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { username: username },
    "your_secret_key", // Use environment variable in production
    { expiresIn: "1h" }
  );
  
  // Store token in session
  req.session.authorization = { token, username };
  
  return res.status(200).json({ message: "Login successful", token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;
  
  // Check if review text is provided
  if (!review) {
    return res.status(400).json({ message: "Review text required" });
  }
  
  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Initialize reviews object if it doesn't exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  
  // Add or update review for this user
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({ 
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
