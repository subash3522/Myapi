const express = require("express");
const router = express.Router();

const db = require("./fifth");

router.get("/newtest", (req, res) => {
  const sql = "SELECT * FROM login";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

module.exports = router;
