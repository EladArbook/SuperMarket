const Joi = require("joi");

class Product {

    constructor(product) {
        this.name = product.name;
        this.category_id = product.category_id;
        this.price = product.price;
        this.image = product.image;
    }

    static #validationSchema = Joi.object({
        name: Joi.string().required().min(2).max(20),
        category_id: Joi.number().required().min(1).max(8),
        price: Joi.number().required().min(0).max(99999),
        image: Joi.string().min(0)
        //image: Joi.string().required().min(0).max(40),
    });

    validate() {
        const result = Product.#validationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }
}

module.exports = Product;