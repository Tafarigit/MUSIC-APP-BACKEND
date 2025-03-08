// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// });

// pool.on("connect", () => {
//     console.log("Connected to the database");
// })

// module.exports = pool;

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "musicdb",
    password: process.env.DB_PASSWORD || "",
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

pool.on("connect", () => {
    console.log("✅ Connected to the database");
});

pool.on("error", (err) => {
    console.error("❌ Database connection error:", err);
    process.exit(-1); // Prevents silent crashes
});

module.exports = pool;
