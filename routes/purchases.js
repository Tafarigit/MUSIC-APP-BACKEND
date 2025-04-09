const express = require("express");
const pool = require("../dbConfig/dbConfig");
const router = express.Router();
const { v4: isUuid } = require("uuid");



// //Get purchases by purchaseid
router.get("/:purchaseId", async (req, res) => {
  try {
    const { purchaseId } = req.params;  // Extract purchaseId from the URL parameter
    console.log("Purchase ID:", purchaseId)
    const { rows } = await pool.query(
      "SELECT * FROM purchases WHERE id = $1",  // Query by 'id' column, not 'user_id'
      [purchaseId]  // Use the purchaseId from the URL
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.json(rows[0]);  // Return the first matching purchase
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// //Get all purchases
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM purchases ORDER BY purchase_date DESC");
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
    console.log("Request body:", req.body);
    if(!user_id || !song_id || price === null) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await pool.query("SELECT NOW()", (err, res) => {
      if (err) console.error("Database connection error:", err);
      else console.log("Database connected:", res.rows);
    });// Connect to the database
    const { rows } = await pool.query(
      "INSERT INTO purchases (id, user_id, song_id, purchase_date, price) VALUES (gen_random_uuid(), $1, $2, NOW(), $3) RETURNING *",
      [user_id, song_id, price]
    );
    console.log("Inserted purchases:", rows[0]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a purchase (if needed)
// router.delete("/purchases/:purchaseId", async (req, res) => {
//   try {
//     const { purchaseId } = req.params;
//     console.log("Received DELETE request for purchaseId:", purchaseId); // Debugging

//     const { rowCount } = await pool.query("DELETE FROM purchases WHERE id = $1", [purchaseId]);

//     if (rowCount === 0) {
//     console.log("Purchase not found in DB.");
//     return res.status(404).json({ error: "Purchase not found" });
//     }
//     res.json({ message: "Purchase deleted successfully" });
//     console.log("Purchases deleted successfully")
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
router.delete("/:purchaseId", async (req, res) => {
  try {
    console.log("Full request received:", req.params); // Log full request parameters
    const { purchaseId } = req.params;
    
    if (!purchaseId) {
      console.log("purchaseId is missing in the request");
      return res.status(400).json({ error: "Missing purchase ID" });
    }

    console.log("Attempting to delete purchase with ID:", purchaseId);
    const { rowCount } = await pool.query("DELETE FROM purchases WHERE id = $1", [purchaseId]);

    if (rowCount === 0) {
      console.log("Purchase not found in DB.");
      return res.status(404).json({ error: "Purchase not found" });
    }

    console.log("Purchase deleted successfully");
    res.json({ message: "Purchase deleted successfully" });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// module.exports = router;

module.exports = router;
// router.post("/", async (req, res) => {
//   const { user_id, song_id, price } = req.body;

//   // Validate that required fields are present in the request body
//   if (!user_id || !song_id || !price) {
//     return res.status(400).json({ error: "user_id, song_id, and price are required" });
//   }

//   try {
//     // Check if the user and song exist in their respective tables before proceeding
//     const userCheck = await pool.query("SELECT 1 FROM users WHERE id = $1", [user_id]);
//     const songCheck = await pool.query("SELECT 1 FROM songs WHERE id = $1", [song_id]);

//     // If user or song doesn't exist, return an error
//     if (userCheck.rowCount === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (songCheck.rowCount === 0) {
//       return res.status(404).json({ error: "Song not found" });
//     }

//     // Perform the insert query to add the purchase
//     const { rows } = await pool.query(
//       "INSERT INTO purchases (id, user_id, song_id, purchase_date, price) VALUES (gen_random_uuid(), $1, $2, NOW(), $3) RETURNING *",
//       [user_id, song_id, price]
//     );

//     // Return the newly created purchase record
//     res.status(201).json(rows[0]);
//   } catch (err) {
//     console.error("Error inserting purchase:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });




// module.exports = router