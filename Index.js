express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());
const aata = { user: ["user1", "user2", "user3"] };

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.get("/bpi", (req, res) => {
  res.json(aata);
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup",
});

const sb = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12652310",
  password: "uINDUhDptU",
  database: "sql12652310",
});

app.get("/newtest", (req, res) => {
  const sql = "SELECT * FROM Login";
  sb.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/newtest", (req, res) => {
  const sql = "INSERT INTO Login (Email, Phone, Password) VALUES (?,?,?)";

  const value = [req.body.email, req.body.phoneNumber, req.body.password];
  db.query(sql, value, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/newapi", (req, res) => {
  const sql = "INSERT INTO Login (Email, Phone, Password) VALUES (?,?,?)";

  const value = [req.body.email, req.body.phoneNumber, req.body.password];
  sb.query(sql, value, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});



app.post("/spi", (req, res) => {
  const sql =
    "INSERT INTO signup_details (name, email, password) VALUES (?, ?, ?)";

  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/spi", (req, res) => {
  const sql = "SELECT * FROM signup_details"; // This SQL query fetches all rows from the table
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen( process.env.PORT || 5000, () => {
  console.log("it is ");
});
