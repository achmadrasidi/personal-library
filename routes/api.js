/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Books = require("../model/books.js");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      const book = await Books.find();
      try {
        res.json(book);
      } catch (error) {
        res.send("no book exists");
      }

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      const title = req.body.title;
      const book = await Books.create({
        title,
      });

      if (!title) {
        res.send("missing required field title");
        return;
      }

      res.json({ _id: book._id, title: book.title });
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      Books.deleteMany({}, (err, data) => {
        if (err || !data) {
          res.send("no book exists");
        } else {
          res.send("complete delete successful");
        }
      });
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;

      Books.findById({ _id: bookid }, (err, data) => {
        if (err || data === null) {
          return res.send("no book exists");
        } else {
          return res.json(data);
        }
      });

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      const comment = req.body.comment;

      if (!comment) {
        res.send("missing required field comment");
        return;
      }

      Books.findOneAndUpdate({ _id: bookid }, { $push: { comments: comment }, $inc: { commentcount: 1 } }, { new: true }, (err, data) => {
        if (err || data === null) {
          res.send("no book exists");
        } else {
          res.json(data);
        }
      });
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      Books.findByIdAndDelete({ _id: bookid }, (err, data) => {
        if (err || data === null) {
          return res.send("no book exists");
        } else {
          return res.send("delete successful");
        }
      });

      //if successful response will be 'delete successful'
    });
};
