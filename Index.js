express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const jws = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

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

const mb = mysql.createConnection({
  host: "bbzrefjh7xcte7myk21j-mysql.services.clever-cloud.com",
  user: "uuvp8d7q1g3nihqg",
  password: "prJdEFZ50aFr7QibgJuY",
  database: "bbzrefjh7xcte7myk21j",
});

const sb = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12652310",
  password: "uINDUhDptU",
  database: "sql12652310",
});

app.get("/newtest", (req, res) => {
  const sql = "SELECT * FROM login";
  db.query(sql, (err, data) => {
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
  const sql = "INSERT INTO login (Email, Phone, Password) VALUES (?,?,?)";

  const value = [req.body.email, req.body.phoneNumber, req.body.password];
  db.query(sql, value, (err, data) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.json(err);
    }
    return res.json(data);
  });
});

//for suvasearch signup post method

app.post("/suvasearchsignup", (req, res) => {
  const sql = "INSERT INTO login_table (Email, Password) VALUES (?,?)";

  const value = [req.body.email, req.body.password];

  mb.query(sql, value, (err, data) => {
    if (err) {
      console.error("error executing sql query:", err);
      return res.json(err);
    }
    return res.json(data);
  });
});
// app.get("/suvasearchsignup", (req, res) => {
  
app.get("/suvasearchsignup", (req, res) => {
  const sql = "SELECT * FROM login_table";
  mb.query(sql, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

const verifyuser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("no token found");
    return res.json({ error: "token not verified" });
  } else {
    jws.verify(token, "jwt-secret-key", (err, decode) => {
      if (err) {
        return res.json({ error: "token is not ok" });
      } else {
        res.email = decode.email;
        next();
      }
    });
  }
};

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: "successful" });
});

app.post("/userlogin", (req, res) => {
  const sql = "SELECT * FROM login WHERE Email = ? AND Password = ?";
  const values = [req.body.email, req.body.password];
  console.log(req.body.email, req.body.password);
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (data.length > 0) {
      const email = data[0].email;
      const token = jws.sign({ email }, "jwt-secret-key", { expiresIn: "1d" });
      res.cookie("token", token);

      return res.json({ status: "success" });
    } else {
      return res.json({ message: "Invalid email or password" });
    }
  });
});

app.get("/auth", verifyuser, (req, res) => {
  return res.json({ status: "success", email: res.email });
});

app.get("/userlogin", (req, res) => {
  const sql = "SELECT * FROM login WHERE Email = ?";
  const value = "admin@gmail.com";
  db.query(sql, value, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.get("/userdelete", (req, res) => {
  const sql = "SELECT * FROM login";

  db.query(sql, (err, data) => {
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
  const sql = "SELECT * FROM signup_details";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(process.env.PORT || 5001, () => {
  console.log("it is ");
});
