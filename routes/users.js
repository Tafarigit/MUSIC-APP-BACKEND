const express = require("express");
const pool = require("../dbConfig/dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, username, email, created_at FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("POST /users payload:", req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const { rows } = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, password]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameter
    const { username, email, password } = req.body; // Get updated details from the request body

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const { rows } = await pool.query(
      "UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, username, email, created_at",
      [username, email, password, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]); // Send the updated user data back in the response
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
      userId
    ]);
    if (rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
