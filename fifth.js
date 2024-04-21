const express = require('express')
const mysql = require('mysql')

const myDatabase = mysql.createConnection({
  host: "65.109.99.134",
  user: "shivaksh_subash",
  password: "Subash@123",
  database: "shivaksh_suvasearch",
});


  module.exports = myDatabase


 