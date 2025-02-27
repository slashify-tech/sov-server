import mongoose, { Schema } from "mongoose";

// Define the schema for the courses
const CourseSchema = new Schema({
    courseName: {
    type: String,  
    required: true,  
  },
}, {
  timestamps: true,  
});

// Create the Course model
export const Course = mongoose.model("Course", CourseSchema);
