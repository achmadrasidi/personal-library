/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
        assert.property(res.body[0], "title", "Books in array should contain title");
        assert.property(res.body[0], "_id", "Books in array should contain _id");
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */
  let delId;
  suite("Routing tests", function () {
    suite("POST /api/books with title => create book object/expect book object", function () {
      test("Test POST /api/books with title", function (done) {
        chai
          .request(server)
          .post("/api/books")
          .set("content-type", "application/json")
          .send({ title: "30 ways to coding" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an Object");
              delId = res.body._id;
              assert.equal(res.body.title, "30 ways to coding");
              assert.property(res.body, "_id", "Books object should contain id");
              assert.property(res.body, "title", "Books object should contain title");
              done();
            }
          });
      });
      test("Test POST /api/books with no title given", function (done) {
        chai
          .request(server)
          .post("/api/books")
          .set("content-type", "application/json")
          .send({ title: "" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, undefined);
              assert.equal(res.text, "missing required field title");
              done();
            }
          });
      });
    });

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.isArray(res.body, "response should be an array");
              assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
              assert.property(res.body[0], "title", "Books in array should contain title");
              assert.property(res.body[0], "_id", "Books in array should contain _id");
              done();
            }
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/asda")
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, undefined);
              assert.equal(res.text, "no book exists");
              done();
            }
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/6233637607ae6ab177f665f7")
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an Object");
              assert.equal(res.body.title, "30 ways to coding");
              assert.isArray(res.body.comments, "comments should be an array");
              assert.equal(res.body._id, "6233637607ae6ab177f665f7");
              done();
            }
          });
      });
    });

    suite("POST /api/books/[id] => add comment/expect book object with id", function () {
      test("Test POST /api/books/[id] with comment", function (done) {
        chai
          .request(server)
          .post("/api/books/6233637607ae6ab177f665f7")
          .set("content-type", "application/json")
          .send({ comment: "woyoooo" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, "6233637607ae6ab177f665f7");
              assert.isObject(res.body, "should be an Object");
              assert.isArray(res.body.comments, "comments should be an array");
              done();
            }
          });
      });

      test("Test POST /api/books/[id] without comment field", function (done) {
        chai
          .request(server)
          .post("/api/books/6233637607ae6ab177f665f7")
          .send({ comment: "" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.comment, undefined);
              assert.equal(res.text, "missing required field comment");
              done();
            }
          });
      });

      test("Test POST /api/books/[id] with comment, id not in db", function (done) {
        chai
          .request(server)
          .post("/api/books/asda")
          .send({ comment: "halo semua" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, undefined);
              assert.equal(res.text, "no book exists");
              done();
            }
          });
      });
    });

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${delId}`)
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.text, "delete successful");
              done();
            }
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/asdasd`)
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, undefined);
              assert.equal(res.text, "no book exists");
              done();
            }
          });
      });
    });
  });
});
