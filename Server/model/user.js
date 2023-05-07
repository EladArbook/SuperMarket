const Joi = require("joi");

class User {

    constructor(user) {
        this.id = user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.pass = user.pass;
        this.city = user.city;
        this.street = user.street;
        this.role = user.role;
    }

    static #validationSchema = Joi.object({
        id: Joi.number().required().min(100000).max(999999999),
        first_name: Joi.string().required().min(2).max(20),
        last_name: Joi.string().required().min(2).max(20),
        email: Joi.string().required().email({ tlds: { allow: false } }).message({
            'string.email': "Email address must be valid",
        }),
        pass: Joi.string().required().min(6).max(20),
        city: Joi.string().max(20),
        street: Joi.string().max(20),
        role: Joi.string().min(0).max(4)
    });

    validate() {
        const result = User.#validationSchema.validate(this, { abortEarly: true });
        return result.error ? result.error.details.map(err => err.message) : null;
    }
}

module.exports = User;