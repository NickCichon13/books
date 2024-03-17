const express = require("express");
const Book = require("../models/book");

const jsonschema = require("jsonschema");
const bookSchema = require("../schema/bookSchema.json");
const ExpressError = require("../expressError");

const router = new express.Router();


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */
// We added a validation error to out creating route, this will throw an error if required information is missing.
router.post("/", async function (req, res, next) {
  try{
    const validation = jsonschema.validate(req.body, bookSchema);
    if(!validation.valid){
        const listOfErrors = validation.errors.map(e => e.stack);
        const err = new ExpressError(listOfErrors, 400);

        return next(err);
    }
    const book = await book.create(req.body, bookSchema);
    return res.json( {book} )

    } catch(err){
        return next(err)
    }
   
});

/** PUT /[isbn]   bookData => {book: updatedBook} **/
// Added Validation errors to our put/patch route, this will throw a error if changing information on a book is valid.
router.put("/:isbn", async function (req, res, next) {
  try{
    const validation = jsonschema.validate(req.body, bookSchema);
    if(!validation.valid){
        const listOfErrors = validation.errors.map(e => e.stack);
        const err = new ExpressError(listOfErrors, 400);

        return next(err);
    }

    const book = await Book.update(req.params.isbn, req.body);
    return res.json( {book} )

  } catch(err){

    return next(err);
  }
    
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
