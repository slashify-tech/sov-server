import mongoose from "mongoose";
import connectDb from "../db/index.js"; // Import your custom connectDb function
import bcrypt from "bcrypt";
import { Admin } from "../models/admin.model.js";

// Async IIFE to insert admin data into the database
(async () => {
  try {
    // Connect to the database
    await connectDb();

    // Define admin data
    const adminData = {
      profilePicture: "", 
      firstName: "Slashify",
      lastName: "Tech",
      dob: "1990-05-10", 
      email: "theslashify@gamil.com",
      password: "slashifytech0023",
      phone: "+12345445467890",
      role: "0"
    };

    // Create and save the admin document
    const admin = new Admin(adminData);
    await admin.save();
    console.log("Admin data saved successfully!");

  } catch (error) {
    console.error("Error saving admin data:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
})();
