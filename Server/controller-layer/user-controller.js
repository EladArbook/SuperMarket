const express = require("express");
const router = express.Router();
const userLogic = require('../bussiness-logic-layer/user-logic');
const verifyLoggedIn = require("../middleware/verify-logged-In");
const path = require("path");

router.get("/generalInfo", async (req, res) => {
    try {
        const info = await userLogic.getInfo();
        res.status(200).send(info);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Server Error" });
    }
});

router.get("/allProducts", verifyLoggedIn, async (req,res) =>{
    try {
        const productList = await userLogic.getAllProducts();
        res.status(200).send(productList);
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ error: "No order found" });
    }
});

router.get("/lastOrder/:id", verifyLoggedIn, async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await userLogic.getOrderInfo(userId);
        res.status(200).send(userData);
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ error: "No order found" });
    }
});

router.get("/productsByCategory/:id", verifyLoggedIn, async (req, res) => {
    try {
        const categoryId = req.params.id;

        const productList = await userLogic.getProductsByCategory(categoryId);
        res.status(200).send(productList);
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ error: "Products weren't found" })
    }
});

router.post("/createCart", verifyLoggedIn, async (req, res) => {
    try {
        const customerId = req.body;
        const myDate = new Date();
        const cartDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();
        await userLogic.createCart(customerId.id, cartDate);
        res.status(201).send({ message: "Cart created" });
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ error: "Couldn't create a cart" });
    }
});

router.get("/getCartId/:id", verifyLoggedIn, async (req, res) => {
    try {
        const customerId = req.params.id;
        const cart = await userLogic.getCartByCustomerId(customerId);
        res.status(200).send({ cartId: cart[cart.length - 1].id });
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ error: "Cart wasn't found" })
    }
});

router.get("/getCartProducts/:id", verifyLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.id;
        const cartProducts = await userLogic.getProductsByCartId(cartId);
        res.status(200).send(cartProducts);
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ error: "Products weren't found" });
    }
});

router.post("/addToCart", verifyLoggedIn, async (req, res) => {
    try {
        const cartProduct = req.body;
        await userLogic.addProductToCart(cartProduct);
        res.status(201).send({ message: "Product added" });
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ message: "Couldn't add product to cart" });
    }
});

router.get("/orderPerDay/:date", verifyLoggedIn, async (req, res) => {
    const orderDate = req.params.date;
    const dateAnswer = await userLogic.checkOrdersPerDay(orderDate);
    if (dateAnswer.length < 2)
        res.status(201).send({ isAvailable: true });
    else
        res.status(201).send({ isAvailable: false });
});

router.post("/newOrder", verifyLoggedIn, async (req, res) => {
    try {
        const orderDetails = req.body;

        await userLogic.newOrder(orderDetails);
        res.status(201).send({ message: "Order success" });
    }
    catch (err) {
        console.log(err.message);
        res.status(201).send({ message: "Couldn't make order" })
    }
});

router.delete("/deleteProduct/:product/:cart", async (req, res) => {
    try {
        const productId = req.params.product;
        const cartId = req.params.cart;
        if (await userLogic.deleteCartProduct(productId, cartId))
            res.status(200).send({ message: "Product deleted" });
        else
            res.status(400).send({ error: "Couldn't delete cart product" });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Couldn't delete cart product" });
    }
});

router.delete("/deleteAll/:cart", async (req, res) => {
    try {
        const cartId = req.params.cart;
        if (await userLogic.deleteAllCartProducts(cartId))
            res.status(200).send({ message: "All poroducts deleted" });
        else
            res.status(400).send({ error: "Couldn't delete cart products" });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ error: "Couldn't delete cart products" });
    }
});

router.get("/images/:imageName", async (req, res) => {
    try {
        const imageName = req.params.imageName;
        let imagePath = path.join(__dirname, "..", "upload", imageName);
        res.status(200).sendFile(imagePath);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Image wasn't found.");
    }
});

router.get("/imageByProduct/:productId", async (req, res) => {
    try {
        const productId = String(req.params.productId);
        const imageName = await userLogic.imageNameByProductId(productId);
        const imagePath = path.join(__dirname, "..", "upload", imageName[0].image);
        res.status(200).sendFile(imagePath);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Image wasn't found.");
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