express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const jws = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "suvasearch.com",
      "https://apitesting-com.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.static("publicimages"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "publicimages");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

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

//post for image upload
app.post("/upload", upload.single("image"), (req, res) => {
  const image = req.file.filename;
  const sql = "INSERT INTO imagetable (Image) VALUES (?)";

  mb.query(sql, [image], (err, result) => {
    if (err) return res.json({ message: "error image" });
    return res.json({ status: "success" });
  });
});

app.get("/upload", (req, res) => {
  const sql = "SELECT * FROM imagetable";
  mb.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
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

//dummy testing
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

//suvasearch signup get

// app.get("/suvasearchsignup", (req, res) => {
app.get("/suvasearchsignup", (req, res) => {
  const sql = "SELECT * FROM login_table";
  mb.query(sql, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

//verify user for bad ui
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

//suvasearch user verification
const verifySuvauser = (req, res, next) => {
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

//logout function for badui
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: "successful" });
});

//logout function for suvasearch
app.get("/suvalogout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: "successful" });
});

// login verification for badui
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

//for suvasearch login verification
app.post("/suvasearchlogin", (req, res) => {
  const sql = "SELECT * FROM login_table WHERE Email= ? AND Password = ?";
  const value = [req.body.email, req.body.password];
  mb.query(sql, value, (err, data) => {
    if (err) return res.json(err);

    if (data.length > 0) {
      const email = data[0].email;
      const token = jws.sign({ email }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      res.cookie("token", token);

      return res.json({ status: "success" });
    } else {
      return res.json({ message: "Invalid email or password" });
    }
  });
});

//login authentication for badui
app.get("/auth", verifyuser, (req, res) => {
  return res.json({ status: "success", email: res.email });
});

//login authentication for suvasearch
app.get("/suvaauth", verifySuvauser, (req, res) => {
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

//for delete user of badui
app.get("/userdelete", (req, res) => {
  const sql = "SELECT * FROM login";

  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//post for dummy testing
app.post("/spi", (req, res) => {
  const sql =
    "INSERT INTO signup_details (name, email, password) VALUES (?, ?, ?)";

  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//get for dummy testing
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
