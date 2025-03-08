const express = require('express');
const pool = require("../dbConfig/dbConfig");

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const { rows } = await pool.query("SELECT id, username, email, created_at FROM users");
        res.json(rows);
    }catch(err) {
        console.error(err);
        res.status(500).json({ error: "server error" });
     }
});

module.exports = router;