express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const jws = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const { log } = require("console");
const fs = require("fs").promises;

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "suvasearch.com",
      "https://suvasearch-git-master-subash3522.vercel.app",
      "https://apitesting-com.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.static("publicimages"));

app.use("/uploads", express.static("publicimages"));

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

//for mountains post method
app.post(
  "/api/addMountain",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "description", maxCount: 1 },
  ]),
  (req, res) => {
    const { mountainName, weather, popularity, budget, category } = req.body;
    const photoPath = req.files["photo"][0].filename;
    const descriptionPath = req.files["description"][0].path;
    const sql =
      "INSERT INTO mountains (mountainName,weather, popularity, budget, category, photoPath, descriptionPath) VALUES (?, ?, ?, ?,?,?,?)";
    mb.query(
      sql,
      [
        mountainName,
        weather,
        popularity,
        budget,
        category,
        photoPath,
        descriptionPath,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting into MySQL:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Mountain added to the database");
          res.json({ message: "Mountain added successfully" });
        }
      }
    );
  }
);
//end for mountains post methos

//formountains get method

app.get("/api/mountains", async (req, res) => {
  try {
    const sql = "SELECT * FROM mountains";
    const mountains = await new Promise((resolve, reject) => {
      mb.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Read the content of .txt files
    const mountainsWithContent = await Promise.all(
      mountains.map(async (mountain) => {
        const descriptionPath = mountain.descriptionPath;
        const descriptionContent = await fs.readFile(
          descriptionPath,

          "utf-8"
        );
        return {
          ...mountain,
          descriptionContent,
        };
      })
    );

    res.json({ mountains: mountainsWithContent });
  } catch (error) {
    console.error("Error fetching mountains:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//end of mountains get method

//get method of mountain for id parameter
// app.get("/mountain/:id", (req, res) => {
//   const mountainId = req.params.id;

//   mb.query(
//     "SELECT * FROM mountains WHERE id = ?",
//     [mountainId],
//     (err, results) => {
//       if (err) {
//         console.error("Error querying MySQL:", err);
//         res.status(500).send("Internal Server Error");
//       } else {
//         if (results.length === 0) {
//           res.status(404).send("Mountain not found");
//         } else {
//           res.json(results);
//         }
//       }
//     }
//   );
// });

app.get("/mountain/:id", async (req, res) => {
  const mountainId = req.params.id;

  try {
    const sql = "SELECT * FROM mountains WHERE id = ?";
    const mountain = await new Promise((resolve, reject) => {
      mb.query(sql, [mountainId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (mountain.length === 0) {
      res.status(404).send("Mountain not found");
      return;
    }

    const descriptionPath = mountain[0].descriptionPath;
    const descriptionContent = await fs.readFile(descriptionPath, "utf-8");

    const mountainWithContent = {
      ...mountain[0],
      descriptionContent,
    };

    res.json(mountainWithContent);
  } catch (error) {
    console.error("Error querying MySQL or reading file:", error);
    res.status(500).send("Internal Server Error");
  }
});

//end of get metohd of mountain for id parameter

//get for budget filter
app.get("/mountains/:budget", (req, res) => {
  const mountainId = req.params.budget;

  mb.query(
    "SELECT * FROM mountains WHERE budget = ?",
    [mountainId],
    (err, results) => {
      if (err) {
        console.error("Error querying MySQL:", err);
        res.status(500).send("Internal Server Error");
      } else {
        if (results.length === 0) {
          res.status(404).send("Mountain not found");
        } else {
          res.json(results);
        }
      }
    }
  );
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
    // console.log("no token found");
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
        req.email = decode.email;
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
      const userData = {
        userId: data[0].ID,
        email: data[0].email,
      };
      const token = jws.sign({ email: userData.email }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      res.cookie("token", token);

      return res.json({ status: "success", userData });
    } else {
      return res.json({ message: "Invalid email or password" });
    }
  });
});

//postmethod for like
app.post("/like", (req, res) => {
  const sql = "INSERT INTO Like_Table (UserID, PostID) VALUES (?, ?)";

  const values = [req.body.userIdForLIke, req.body.postIdForLike];
  mb.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
//end of postmethod for like

//get method for like
app.get("/like/:likeId", (req, res) => {
  const likeId = req.params.likeId;

  // SQL query to join Like_Table and Post_Table on PostID
  // and select the Post_Table details where Like_Table.LikeID matches
  const query = `
    SELECT mountains.* 
    FROM mountains
    JOIN Like_Table ON mountains.ID = mountains.ID
    WHERE mountains.ID = ?  
  `;

  mb.query(query, [likeId], (err, results) => {
    if (err) {
      console.error("Error executing the query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("No posts found for the given LikeID.");
    } else {
      res.json(results);
    }
  });
});

//end of get method for like

//login authentication for badui
app.get("/auth", verifyuser, (req, res) => {
  return res.json({ status: "success", email: req.email });
});

//login authentication for suvasearch
app.get("/suvaauth", verifySuvauser, (req, res) => {
  return res.json({ status: "success", Semail: req.email });
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
