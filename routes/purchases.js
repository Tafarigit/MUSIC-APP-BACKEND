const express = require("express");
const pool = require("../dbConfig/dbConfig");


const router = express.Router();

//Get all purchases
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM purchases ORDER BY purchase_date DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//Get purchases for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query("SELECT * FROM purchases WHERE user_id = $1", [userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//Make a new purchase
router.post("/", async (req, res) => {
  try {
    const { user_id, song_id, price } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO purchases (id, user_id, song_id, purchase_date, price) VALUES (gen_random_uuid(), $1, $2, NOW(), $3) RETURNING *",
      [user_id, song_id, price]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//Delete a purchase (if needed)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM purchases WHERE id = $1", [id]);

    if (rowCount === 0) return res.status(404).json({ error: "Purchase not found" });

    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;