require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./dbConfig/dbConfig"); //Import database connection

const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(cors());

//Import routes
const userRoutes = require('./routes/users');
const songsRoutes = require('./routes/songs');
const purchasesRoutes = require('./routes/purchases');

//Register routes
app.use('/users', userRoutes);
app.use('/songs', songsRoutes);
app.use('/purchases', purchasesRoutes);

// app.use(express.static("public"));
//Test route
app.get("/", (req, res) => {
    res.send("Music Streaming API is running...");
})

//get all users

app.get('/users', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users'); // ✅ This is inside an async function
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// const express = require("express");
// const app = express();
// const pool = require("./dbConfig/dbConfig"); // Ensure this path is correct

// // Middleware
// app.use(express.json());

// // Routes
// const usersRoutes = require("./routes/users");
// const songsRoutes = require("./routes/songs");
// const purchasesRoutes = require("./routes/purchases");

// app.use("/users", usersRoutes);
// app.use("/songs", songsRoutes);
// app.use("/purchases", purchasesRoutes);

// // Server Listening
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`✅ Server is running on port ${PORT}`);
// });
