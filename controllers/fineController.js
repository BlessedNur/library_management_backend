const Fine = require("../models/Fine");
const Loan = require("../models/Loan");

const getFines = async (req, res) => {
  try {
    const fines = await Fine.find()
      .populate("user", "name email")
      .populate({
        path: "loan",
        populate: {
          path: "book",
          select: "title author",
        },
      });
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createFine = async (req, res) => {
  try {
    const { loanId, amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const fine = await Fine.create({
      user: loan.user,
      loan: loanId,
      amount,
    });

    res.status(201).json(fine);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const payFine = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    fine.status = "paid";
    await fine.save();

    res.json(fine);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getFines,
  createFine,
  payFine,
};
