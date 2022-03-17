require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const bookSchema = new mongoose.Schema({
  comments: [
    {
      type: String,
      require: true,
      default: "",
    },
  ],
  title: {
    type: String,
    default: "",
  },
  commentcount: {
    type: Number,
    default: 0,
  },
});

const Books = mongoose.model("Books", bookSchema);

module.exports = Books;
