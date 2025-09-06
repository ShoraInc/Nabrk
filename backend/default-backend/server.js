require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

require("./models/index");

// Import routes
const newsRoutes = require("./routes/newsRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const pagesRoutes = require("./routes/pagesRoutes");
const blocksRoutes = require("./routes/blocksRoutes");
const blockRelationsRoutes = require("./routes/blockRelationsRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/news", newsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/blocks", blocksRoutes);
app.use("/api/blocks", blockRelationsRoutes);
app.use("/api/questions", require('./routes/questionsRoutes'));
app.use("/api/answers", require('./routes/answersRoutes'));
app.use("/api/types", require('./routes/typesRoutes'));

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Library API is running" });
});

// Start server
const start = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
        
        // Sync database
        await sequelize.sync({ alter: true });
        console.log("Database synchronized");
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error);
    }
};

start();