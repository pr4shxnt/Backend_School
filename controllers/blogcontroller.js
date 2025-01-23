const Blog = require("../Models/blogModel");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

exports.createBlog = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const images = req.files.map((file) => file.filename);

    const newBlog = new Blog({ title, author, content, images });
    await newBlog.save();

    res
      .status(201)
      .json({ message: "Blog created successfully!", blog: newBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
};


exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};

exports.getPendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isReviewed: false });
    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching review blogs", error: error.message });
  }
};

exports.getReviewedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isReviewed: true });
    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviewed blogs", error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, author, content, isReviewed } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.title = title || blog.title;
    blog.author = author || blog.author;
    blog.content = content || blog.content;

    if (typeof isReviewed !== "undefined") {
      blog.isReviewed = isReviewed;
    }

    const updatedBlog = await blog.save();
    res
      .status(200)
      .json({ message: "Blog updated successfully!", blog: updatedBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating blog", error: error.message });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Optionally delete associated images
    blog.images.forEach((image) => {
      const imagePath = path.join(__dirname, "../uploads/blog_images/", image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    res.status(200).json({ message: "Blog deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: error.message });
  }
};
