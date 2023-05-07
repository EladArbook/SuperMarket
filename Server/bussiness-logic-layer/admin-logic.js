const dal = require("../data-access-layer/dal");
const path = require("path");
const fs = require("fs");

// post new product
async function addNewProduct(product, image) {
    if (image.name.length > 30) {
        image.name = image.name.substring(image.name.length - 20, image.name.length);
    }
    const generateName = String(Math.floor(Math.random() * 10000000)) + "_" + image.name;;
    const absolutePath = path.join(__dirname, "..", "upload", generateName);
    await image.mv(absolutePath);
    const sqlCmd = "INSERT INTO `products`(`name`, `category_id`, `price`, `image`) VALUES ('" + product.name +
        "','" + product.category_id + "','" + product.price + "','" + generateName + "')";
    return dal.executeQueryAsync(sqlCmd);
}


async function editProduct(product, id, image) {
    if (image) {//new image
        if (product.image) {//old image exists?
            try {
                const lastImage = path.join(__dirname, "..", "upload", product.image);
                await deleteImage(lastImage);
            }
            catch (imgSrc) {
                console.log(`Image wasn't deleted at '${imgSrc}'`);
            }
        }
        let generateName = String(Math.floor(Math.random() * 1000000)) + "_" + image.name; // 1-of-a-kind name
        if (generateName.length > 39)
            generateName = generateName.substring(generateName.length - 38, generateName.length);
        const absolutePath = path.join(__dirname, "..", "upload", generateName);
        await image.mv(absolutePath);

        const sqlCmd = "UPDATE `products` SET `name`='" + product.name + "',`category_id`='" + product.category_id +
            "',`price`='" + product.price + "',`image`='" + generateName + "' WHERE `id` = '" + id + "'";
        return dal.executeQueryAsync(sqlCmd);
    }
    else {
        const sqlCmd = "UPDATE `products` SET `name`='" + product.name + "',`category_id`='" + product.category_id +
            "',`price`='" + product.price + "' WHERE `id` = '" + id + "'";
        return dal.executeQueryAsync(sqlCmd);
    }

    /* const sqlCmd = "UPDATE `products` SET `name`='" + product.name + "',`category_id`='" + product.category_id +
        "',`price`='" + product.price + "',`image`='" + generateName + "' WHERE `id` = '" + id + "'";
    return dal.executeQueryAsync(sqlCmd); */
}


// not-exported func for deleting image when patch or delete vacation
async function deleteImage(imagePath) { //async ???????????????????????????????????????????????????
    try {
        fs.unlink(imagePath, (err) => {
            if (err)
                return false;
            else
                return true;
        });
    } catch (err) {
        console.log(err);
        return false;
    }
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

//delete
/* async function deleteBook(id) {
    const sqlCmd = "" + id;
    return dal.executeQueryAsync(sqlCmd);
} */


module.exports = { addNewProduct, editProduct }



