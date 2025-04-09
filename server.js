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
const userRoutes = require("./routes/users");
const songsRoutes = require("./routes/songs");
const purchasesRoutes = require("./routes/purchases");

//Register routes
app.use("/users", userRoutes);
app.use("/songs", songsRoutes);
app.use("/purchases", purchasesRoutes);

//Test route
app.get("/", (req, res) => {
  res.send("Music Streaming API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
