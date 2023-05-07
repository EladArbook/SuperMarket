const express = require("express");
const authLogic = require("../bussiness-logic-layer/auth-logic");
const Credentials = require("../model/credentials");
const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const credentials = new Credentials(req.body); //username + password

        const errors = credentials.validate(); //check if info is correctly inserted
        if (errors) {
            return res.status(400).send({ message: "Invalid username or password" });
        }
        const loggedInUser = await authLogic.loginAsync(credentials); //generate jwt for user
        if (!loggedInUser) {
            return res.status(401).send({ message: "Incorrect username or password" })
        }
        //success
        res.status(200).json(loggedInUser);

    }
    catch (error) {
        console.log(1);
        console.log(error.message);
        res.status(400).send({ message: "Inncorrect username password combination" });
    }
});

router.get("/checkExists/:id/:email", async (req, res) => {//checks is duplicated id/email is used
    try {
        const newId = req.params.id;
        const idFound = await authLogic.getExistId(newId);
        if (idFound && idFound.length > 0)
            return res.status(406).send({ message: "ID number is already in use" });

        const newEmail = req.params.email;
        const emailFound = await authLogic.getExistEmail(newEmail);
        if (emailFound && emailFound.length > 0)
            return res.status(406).send({ message: "Email address is already in use" });

        return res.status(200).send({});
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).send({ message: "Please try again later" });

    }
});

router.post("/register", async (req, res) => {
    try {
        const newUser = req.body;
        if (newUser) {
            const userErrors = await authLogic.addUser(newUser); //register
            if (!userErrors)
                return res.status(201).send({});
            else {
                return res.status(400).send({ message: userErrors[0] });
            }
        }
        else
            throw ({ message: "Post failed" });
    }
    catch (error) {
        res.status(400).send({ message: "Couldn't send user's info" });
        console.log(error.message);
    }
});

module.exports = router;