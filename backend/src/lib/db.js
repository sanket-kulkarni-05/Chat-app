import mongoose from "mongoose";

// export const connectDB = async ()=>{
//     try{
//         const conn  = await mongoose.connect(process.env.MONGODB_URI);  // Fix the spelling
//         serverSelectionTimeoutMS: 5000,  // Timeout after 5s (not 10s)
//       socketTimeoutMS: 30000 
//         console.log(`mongodb is connected: ${conn.connection.host}`);
//     }catch(error){
//         console.log("mongodb connection error:", error);
//     }
// };
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,  // Timeout after 5s (not 10s)
      socketTimeoutMS: 30000          // Close idle connections
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection FAILED:", error.message);
    process.exit(1);  // Crash the server to alert you
  }
};