// import express from "express";
// import dotenv from"dotenv";
// import { connectDB } from "./lib/db.js";
// import authRoutes from "./routes/auth.routes.js";

// dotenv.config()
// const app = express();

// const PORT = process.env.PORT

// app.use(express.json())

// app.use("/api/auth", authRoutes);

// // app.listen(5001, ()=> {
// //     console.log("server is running on PORT:" + PORT);
// // });

// app.listen(process.env.PORT || 5001, () => {  // Use env var first
//   console.log("Server running on port:", process.env.PORT || 5001);
// });


import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js"; // This import is fine - color doesn't indicate error
import authRoutes from "./routes/auth.routes.js";
import cors from "cors"; 
import mongoose from 'mongoose';  // Add this line with other imports
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Fallback to 5001 if not in .env

// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000",
//   credentials: true
// }));


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "UP",
    db: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED"
  });
});

const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(PORT, () => {
      console.log(`✅ Server running on port: ${PORT}`);
      console.log(`🌐 MongoDB status: ${mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED"}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1); 
  }
};

startServer();