const mongoose = require("mongoose");

const validateMongodbid = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("Invalid id");
  }
};

module.exports = { validateMongodbid };
