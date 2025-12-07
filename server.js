import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema for scores
const ScoreSchema = new mongoose.Schema({
  player: String,
  attempts: Number,
  date: { type: Date, default: Date.now }
});
const Score = mongoose.model("Score", ScoreSchema);

// Save score
app.post("/score", async (req, res) => {
  const { player, attempts } = req.body;
  const score = new Score({ player, attempts });
  await score.save();
  res.json({ message: "Score saved!" });
});

// Leaderboard
app.get("/leaderboard", async (req, res) => {
  const scores = await Score.find().sort({ attempts: 1 }).limit(10);
  res.json(scores);
});

// 👉 Add this route here
app.get("/", (req, res) => {
  res.send("Backend is running! 🎉");
});


app.listen(4000, () => console.log("Server running on port 4000"));

