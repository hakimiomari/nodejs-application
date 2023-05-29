const User = require("./../models/userModel");

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      users: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find(req.params.id);
    res.status(200).json({
      status: "success",
      user: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      user: {
        newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      user: {
        updateUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
