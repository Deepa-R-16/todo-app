const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/Todo");
const protect = require("../middleware/auth");

const router = express.Router();
router.use(protect);

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid todo id" });
  next();
};

// GET /api/todos
router.get("/", async (req, res) => {
  const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(todos);
});

// POST /api/todos
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !title.trim())
    return res.status(400).json({ message: "Title is required" });

  const todo = await Todo.create({ user: req.user._id, title, description });
  res.status(201).json(todo);
});

// PUT /api/todos/:id
router.put("/:id", validId, async (req, res) => {
  const { title, description, completed } = req.body;
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (completed !== undefined) update.completed = completed;

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    update,
    { new: true, runValidators: true }
  );
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete("/:id", validId, async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Todo deleted" });
});

module.exports = router;
