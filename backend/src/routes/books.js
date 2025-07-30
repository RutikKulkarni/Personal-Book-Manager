import express from "express";
import { body } from "express-validator";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getStats,
} from "../controllers/bookController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

const bookValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Book title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ max: 100 })
    .withMessage("Author name cannot exceed 100 characters"),
  body("status")
    .optional()
    .isIn(["want-to-read", "reading", "completed"])
    .withMessage("Status must be one of: want-to-read, reading, completed"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),
];

router.use(authMiddleware);

router.get("/stats", getStats);
router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", bookValidation, createBook);
router.put("/:id", bookValidation, updateBook);
router.delete("/:id", deleteBook);

export default router;
