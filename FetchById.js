const express = require("express");
const router = express.Router();
const myDatabase = require("./fifth");

router.get("/fetchUserName/:userId", async (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT Email FROM login_table WHERE ID = ? LIMIT 1";

  myDatabase.query(sql, [userId], (err, result) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(result);
    }
  });
});

module.exports = router;
