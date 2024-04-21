const express = require("express");
const router = express.Router();
const myDatabase = require("./fifth");

router.post("/selectdate/:postId/:destination", async (req, res) => {
  const { postId, destination } = req.params; // Extract postId and destination from URL params
  const { userId, date } = req.body; // Extract userId and date from request body

  // Assuming req.body.date contains a valid date
  const formattedDate = new Date(date).toISOString().split("T")[0]; // Extract YYYY-MM-DD

  const sql =
    "INSERT INTO user_date (userId, date, postId, destination) VALUES (?, ?, ?, ?)";

  myDatabase.query(
    sql,
    [userId, formattedDate, postId, destination],
    (error, result) => {
      if (error) {
        console.error("Error uploading date:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json({
        message: "Date Uploaded Successfully",
        data: result,
      });
    }
  );
});

router.get("/fetchDate/:destination", async (req, res) => {
  const destination = req.params.destination;
  const sql = "SELECT * FROM user_date WHERE destination = ?";

  myDatabase.query(sql, [destination], (err, results) => {
    if (err) {
      console.error("Error fetching dates:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
