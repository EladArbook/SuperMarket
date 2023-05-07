const express = require("express");
const router = express.Router();
const adminLogic = require('../bussiness-logic-layer/admin-logic');
const Product = require("../model/product");
const fileUpload = require("express-fileupload");
const verifyLoggedIn = require("../middleware/verify-logged-In");
const adminVerify = require("../middleware/verify-admin")
router.use(fileUpload());


router.post("/newProduct", async (req, res) => {
    try {
        const newProduct = new Product(JSON.parse(req.body.product));
        const errors = newProduct.validate();

        if (errors) {
            return res.status(400).send({ error: errors });
        }
        else {
            const image = req.files.image;
            if (image)
                await adminLogic.addNewProduct(newProduct, image);
            res.status(201).send({ message: "Product added" });
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Couldn't add product" });
    }
});

router.patch("/editProduct", [verifyLoggedIn, adminVerify], async (req, res) => {
    try {
        const product = JSON.parse(req.body.product);
        const editProduct = new Product(product);
        const editId = product.id;
        const image = req.files?.image;

        const errors = editProduct.validate();
        if (errors) {
            return res.status(400).send({ error: errors });
        }
        else {
            await adminLogic.editProduct(editProduct, editId, image);
            res.status(201).send({ message: "Edited successfully" });
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Couldn't post product" });
    }
});

/* router.get("/", async (req, res) => {
    try {
        //const books = await logicLayer.getAllBooks();
        res.status(200).send(books);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Server Error" });
    }
}); */

/* router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        //const book = await logicLayer.getBookById(id);
        if (book.length > 0)
            res.status(200).send(book);
        else
            throw 'No book found';
    }
    catch (err) {
        res.status(400).send({ error: "Couldn't find book" });
        console.log(err.message);
    }
}); */


/* router.post("/", async (req, res) => {
    try {
        const newBook = req.body;

        const book = new Book(req.body);
        const errors = book.validate();
        if (errors)
        return res.status(400).send({error: ""}); 

        //await adminLogic.addBook(newBook);
        res.status(201).send({ message: "Post OK" });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Couldn't post book" });
    }
}); */

/* router.put("/:id", async (req, res) => { //patch better ?
    try {
        const editBook = req.body;
        const id = req.params.id;
        //await adminLogic.updateBook(editBook, id);
        res.status(200).send({ message: "Put OK" });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Couldn't patch book" });
    }
}); */

/* router.patch("/:id", async (req, res) => {
    try {
        const editBook = req.body;
        const id = req.params.id;
        //await adminLogic.patchBook(editBook, id);
        res.status(200).send({ message: "Patch OK" });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Couldn't patch book" });
    }
}); */

/* router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        //await adminLogic.deleteBook(id);
        res.status(200).send({ message: "Delete OK" });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Couldn't delete book" })
    }
}); */

module.exports = router;