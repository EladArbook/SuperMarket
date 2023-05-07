const dal = require("../data-access-layer/dal");


function getAllProducts(){
    const sqlCmd = "SELECT * FROM `products` WHERE 1";
    return dal.executeQueryAsync(sqlCmd);
}

async function getInfo() { // NO LOGIN REQUIRED
    const sqlCmd1 = "SELECT id FROM `products` WHERE 1";
    const productSum = await dal.executeQueryAsync(sqlCmd1);
    const sqlCmd2 = "SELECT id FROM `orders` WHERE 1";
    const ordersSum = await dal.executeQueryAsync(sqlCmd2);
    const infoSum = { products: productSum.length, orders: ordersSum.length };
    return infoSum;
}

async function getOrderInfo(userId) {

    //cart ? next : return new customer(empty)
    //order ? order=cart : order!=cart

    const sqlCmd = "SELECT `id`,`date` FROM `carts` WHERE `customer_id` = '" + userId + "'";
    const openCart = await dal.executeQueryAsync(sqlCmd);
    if (openCart.length > 0) { // returning customer
        const sqlCmd1 = "SELECT `order_date` FROM `orders` WHERE `cart_id`= '" + openCart[openCart.length - 1].id + "'";
        const lastOrder = await dal.executeQueryAsync(sqlCmd1);
        if (lastOrder.length > 0) { //no open cart - last order date
            return { date: lastOrder[0].order_date, total: -1 };
        }
        else {//cart is waiting
            const sqlCmd2 = "SELECT `total_price` FROM `cart_product` WHERE `cart_id` ='" + openCart[openCart.length - 1].id + "'";
            const cartSum = await dal.executeQueryAsync(sqlCmd2);
            let totalPrice = 0;
            for (let product of cartSum) {
                totalPrice += Number(product.total_price);
            }
            return { date: openCart[openCart.length - 1].date, total: totalPrice };
        }
    }
    else { // first-time-customer
        return {};
    }

}

function createCart(customerId, cartDate) {
    const sqlCmd = "INSERT INTO `carts`(`customer_id`, `date`) VALUES ('" + customerId + "','" + cartDate + "')";
    return dal.executeQueryAsync(sqlCmd);
}

function getCartByCustomerId(customerId) {
    const sqlCmd = "SELECT * FROM `carts` WHERE `customer_id` = " + customerId;
    return dal.executeQueryAsync(sqlCmd);
}

function getProductsByCategory(id) {
    const sqlCmd = "SELECT * FROM `products` WHERE `category_id` = '" + id + "' ORDER BY `name` ASC";
    return dal.executeQueryAsync(sqlCmd);
}

function getProductsByCartId(cartId) {
    //    const sqlCmd = "SELECT * FROM `cart_product` WHERE `cart_id` = '" + cartId + "' ORDER BY `id` DESC";
    const sqlCmd = "SELECT `products`.`name`,`cart_product`.`id`, `cart_product`.`product_id`, `cart_product`.`amount`," +
        "`cart_product`.`total_price`, `cart_product`.`cart_id` FROM`cart_product`, `products` WHERE`cart_id` = '" +
        cartId + "' and `products`.`id` = `cart_product`.`product_id` ORDER BY `id` DESC";
    return dal.executeQueryAsync(sqlCmd);
}

async function addProductToCart(product) {    //send - {product_id, amount, total_price, cart_id}
    const sqlCmd = "SELECT * FROM `cart_product` WHERE `cart_id`='" + product.cart_id + "' and `product_id`='" +
        product.product_id + "'";
    const isExist = await dal.executeQueryAsync(sqlCmd);
    if (isExist.length > 0) {
        product.amount += isExist[0].amount;
        product.total_price += Number(isExist[0].total_price);
        const sqlCmd1 = "UPDATE `cart_product` SET `amount`='" + product.amount + "',`total_price`='" +
            product.total_price + "' WHERE `id`='" + isExist[0].id + "'";
        return dal.executeQueryAsync(sqlCmd1)
    }
    else {
        const sqlCmd2 = "INSERT INTO `cart_product`(`product_id`, `amount`, `total_price`, `cart_id`) VALUES ('" +
            product.product_id + "','" + product.amount + "','" + product.total_price + "','" + product.cart_id + "')";
        return dal.executeQueryAsync(sqlCmd2);
    }
    //refresh cart-sum section
}

function checkOrdersPerDay(orderDate) {
    const sqlCmd = "SELECT * FROM `orders` WHERE `delivery_date` = '" + orderDate + "'";
    return dal.executeQueryAsync(sqlCmd);
}

function newOrder(orderDetails) {
    const sqlCmd = "INSERT INTO `orders`(`customer_id`, `cart_id`, `summary`, `city`, `street`, `delivery_date`," +
        " `order_date`, `payment`) VALUES ('" + orderDetails.customer_id + "','" + orderDetails.cart_id + "','" +
        orderDetails.summary + "','" + orderDetails.city + "','" + orderDetails.street + "','" + orderDetails.delivery_date
        + "','" + orderDetails.order_date + "','" + orderDetails.payment + "')";
    return dal.executeQueryAsync(sqlCmd);
}



function deleteCartProduct(productId, cartId) {
    const sqlCmd = "DELETE FROM `cart_product` WHERE `cart_id` = '" + cartId + "' and `product_id` = '"
        + productId + "'";
    return dal.executeQueryAsync(sqlCmd);
}

function deleteAllCartProducts(cartId) {
    const sqlCmd = "DELETE FROM `cart_product` WHERE `cart_id` = '" + cartId + "'";
    return dal.executeQueryAsync(sqlCmd);
}

function imageNameByProductId(productId) {
    const sqlCmd = "SELECT `image` FROM `products` WHERE `id` = '" + productId + "'";
    return dal.executeQueryAsync(sqlCmd);
}


//async - required ??????????????

//get all
/* async function getAllBooks() {
    const sqlCmd = "";
    return dal.executeQueryAsync(sqlCmd);
} */

//get by id
/* async function getBookById(id) {
    const sqlCmd = "" + id;
    return dal.executeQueryAsync(sqlCmd);
} */

// post
/* async function addBook(newBook) {
    const sqlCmd = "";
    return dal.executeQueryAsync(sqlCmd);
} */

//put
/* async function updateBook(editBook, id) {
    const sqlCmd = "";
    return dal.executeQueryAsync(sqlCmd);
} */

//patch vacation's data
/* async function patchVacation(updateVac, image) {
        const sqlCmd = "";
        return dal.executeQueryAsync(sqlCmd);
} */




module.exports = {
    getInfo, getOrderInfo, getProductsByCategory, createCart, getCartByCustomerId,
    getProductsByCartId, addProductToCart, newOrder, checkOrdersPerDay, deleteCartProduct,
    deleteAllCartProducts, imageNameByProductId, getAllProducts
}



