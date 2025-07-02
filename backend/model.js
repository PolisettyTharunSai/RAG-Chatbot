import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  title:   String,
  url:     String,
  content: String,
}, { timestamps: true });

export const Page = mongoose.model("Page", pageSchema);

//to import this model in other files, use:
// import { Page } from "./model.js";
// Ensure to connect to MongoDB before using this model
// Example connection code (to be used in your main application file):
// await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// Note: Make sure to handle connection errors and disconnections properly in your application.
// This model can now be used to create, read, update, and delete pages in your MongoDB database.
// Example usage:
// const newPage = new Page({
//   title: "Example Title",
//   url: "https://example.com",
//   content: "This is an example content."
// });
// await newPage.save();
// console.log("Page saved successfully:", newPage);