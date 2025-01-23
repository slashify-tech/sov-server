// // import necessary modules
// import mongoose from "mongoose";
// import connectDb from "../db/index.js"; // Adjust this path as necessary
// import { courses, popularCourses } from "./courseData.js";
// import { Course } from "../models/course.model.js";
// import { PopularCourse } from "../models/popularCourseModel.js";

// // Async IIFE to insert new course data into the Course collection
// (async () => {
//   try {
//     // Connect to the database
//     await connectDb();

//     // Prepare the course data for insertion
//     const courseDocuments = popularCourses.map(courseName => ({
//       courseName,  // Map course name to courseName field in the schema
//     }));

//     // Insert new courses, ignoring duplicates
//     const insertResult = await PopularCourse.insertMany(courseDocuments, { ordered: false });

//     console.log("Number of courses inserted:", insertResult.length);

//   } catch (error) {
//     if (error.code === 11000) {
//       console.error("Duplicate entries encountered, some courses were not inserted.");
//     } else {
//       console.error("Error inserting course data:", error);
//     }
//   } finally {
//     mongoose.connection.close();
//   }
// })();
