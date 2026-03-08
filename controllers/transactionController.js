const Transaction = require("../models/Transaction");

const createTransaction = async (req, res, next) => {
  try {
    const { title, amount } = req.body;

    if (!title || typeof amount !== "number") {
      return res.status(400).json({ message: "Title and numeric amount are required" });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      title,
      amount
    });

    res.status(201).json({
      message: "Transaction created",
      transaction
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({
      createdAt: -1
    });
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const { title, amount } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (typeof title === "string" && title.trim().length > 0) {
      transaction.title = title;
    }
    if (typeof amount === "number") {
      transaction.amount = amount;
    }

    await transaction.save();

    res.status(200).json({
      message: "Transaction updated",
      transaction
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
