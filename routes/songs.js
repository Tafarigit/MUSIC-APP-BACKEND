const express = require('express');
const pool = require("../dbConfig/dbConfig");


const router = express.Router();

//Get all songs
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM songs ORDER BY created_at DESC');
        res.json(rows);
    
    }catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching songs' });
    }
})

//Get song by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM songs WHERE id = $1',
            [id]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Song not found' });
                }
                res.json(rows[0]);
                }catch(err) {
                    console.error(err);
                    res.status(500).json({ message: 'Error fetching song' });
                    }
                    })
//Add a new song
router.post("/", async (req, res) => {
    try {
      const { title, artist, album, genre, release_date, duration } = req.body;
  
      const { rows } = await pool.query(
        "INSERT INTO songs (id, title, artist, album, genre, release_date, duration) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6) RETURNING *",
        [title, artist, album, genre, release_date, duration]
      );
  
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  //Update a song
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, artist, album, genre, release_date, duration } = req.body;
  
      const { rows } = await pool.query(
        "UPDATE songs SET title=$1, artist=$2, album=$3, genre=$4, release_date=$5, duration=$6 WHERE id=$7 RETURNING *",
        [title, artist, album, genre, release_date, duration, id]
      );
  
      if (rows.length === 0) return res.status(404).json({ error: "Song not found" });
  
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  //Delete a song
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const { rowCount } = await pool.query("DELETE FROM songs WHERE id = $1", [id]);
  
      if (rowCount === 0) return res.status(404).json({ error: "Song not found" });
  
      res.json({ message: "Song deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  module.exports = router;
