express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const jws = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const fs = require('fs');
const path = require('path');

const directoryPath = path.join('publicimages'); // Root folder path

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  const imageFiles = files.filter(file => {
    // Filter files based on image extensions (e.g., .jpg, .png)
    return ['.jpg', '.png', '.jpeg'].includes(path.extname(file).toLowerCase());
  });

  console.log('Image files:', imageFiles);
  // Here, 'imageFiles' contains the names of image files in the root folder
});

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "bbzrefjh7xcte7myk21j-mysql.services.clever-cloud.com",
    user: "uuvp8d7q1g3nihqg",
    password: "prJdEFZ50aFr7QibgJuY",
    database: "bbzrefjh7xcte7myk21j",
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }

  console.log('Connected to database');

  // Assuming 'images' is your table name
  imageFiles.forEach(fileName => {
    const imagePath = path.join(__dirname, fileName); // Construct full path

    const sql = 'INSERT INTO imagetable (Image) VALUES (?)';

    connection.query(sql, [imagePath], (error, results) => {
      if (error) {
        console.error('Error inserting image path:', error);
        return;
      }
      console.log('Image path inserted:', imagePath);
    });
  });
});
