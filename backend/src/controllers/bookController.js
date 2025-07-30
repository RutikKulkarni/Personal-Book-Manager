import { validationResult } from "express-validator";
import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
  try {
    const { status, tag, search } = req.query;
    const filter = { user: req.user._id };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Get books error:", error.message);
    res.status(500).json({ message: "Server error while fetching books" });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Get book error:", error.message);
    res.status(500).json({ message: "Server error while fetching book" });
  }
};

export const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, author, tags, status, notes } = req.body;

    const book = new Book({
      title,
      author,
      tags: tags || [],
      status: status || "want-to-read",
      notes,
      user: req.user._id,
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    console.error("Create book error:", error.message);
    res.status(500).json({ message: "Server error while creating book" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, tags, status, notes } = req.body;

    Object.assign(book, {
      title: title || book.title,
      author: author || book.author,
      tags: tags !== undefined ? tags : book.tags,
      status: status || book.status,
      notes: notes !== undefined ? notes : book.notes,
    });

    await book.save();

    res.json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    console.error("Update book error:", error.message);
    res.status(500).json({ message: "Server error while updating book" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error.message);
    res.status(500).json({ message: "Server error while deleting book" });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [stats, totalBooks, recentBooks] = await Promise.all([
      Book.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Book.countDocuments({ user: userId }),
      Book.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title author status createdAt"),
    ]);

    const formattedStats = {
      total: totalBooks,
      "want-to-read": 0,
      reading: 0,
      completed: 0,
    };

    stats.forEach(({ _id, count }) => {
      formattedStats[_id] = count;
    });

    res.json({
      success: true,
      data: {
        stats: formattedStats,
        recentBooks,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error.message);
    res.status(500).json({ message: "Server error while fetching statistics" });
  }
};
