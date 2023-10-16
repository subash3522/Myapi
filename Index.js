express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const jws = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

app.use(cors({
  origin:["http://localhost:3000"],
  methods:['GET','POST'],
  credentials:true
}));

app.use(express.json());
const aata = { user: ["user1", "user2", "user3"] };

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
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/userlogin", (req,res)=>{
  const sql = "SELECT * FROM Login WHERE Email = ? AND Password = ?";
  const values = [req.body.email, req.body.password];
  console.log(req.body.email, req.body.password);
  sb.query(sql, values, (err,data)=>{
    if(err) {
      return res.json(err);
    }
    if(data.length > 0){
const name = data[0].name;
const token = jws.sign({name},"jwt-secret-key",{expiresIn:"1d"});
res.cookie('token',token);

      return res.json({ status: "success" });

    } else {
      return res.json({ message: "Invalid email or password" });
    }
  });
})

app.get("/userlogin", (req,res)=>{
const sql = "SELECT * FROM Login WHERE Email = ?"
const value = "admin@gmail.com"
sb.query(sql,value, (err,data)=>{
  if(err){
    return res.json(err)
  }
  else{
    return res.json(data)
  }
})
})

app.get("/userdelete", (req, res) => {
  const sql = "SELECT * FROM Login";

  sb.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  })
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
  const sql = "SELECT * FROM signup_details";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(process.env.PORT || 5001, () => {
  console.log("it is ");
});
