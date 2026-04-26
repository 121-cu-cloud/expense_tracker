const router = require("express").Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// Add expense
router.post("/", auth, async (req, res) => {
  const expense = new Expense({
    ...req.body,
    userId: req.user.id
  });

  await expense.save();
  res.json(expense);
});

// Get all expenses
router.get("/", auth, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.id });
  res.json(expenses);
});

// Delete expense
router.delete("/:id", auth, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;