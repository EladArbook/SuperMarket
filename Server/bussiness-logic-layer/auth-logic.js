const dal = require("../data-access-layer/dal");
const jwt = require("jsonwebtoken");
const config = require("../configuration");
const User = require("../model/user");

//bring user's data once logged-in
async function loginAsync(credentials) {

    const sqlCmd = "SELECT * FROM `customers` WHERE `email`= '" + credentials.username + "' and `pass`='" + credentials.password + "'";
    const user = await dal.executeQueryAsync(sqlCmd);

    if (!user || user.length < 1)
        return null;

    delete user[0].pass;

    user[0].token = jwt.sign({ user: user[0] }, config.jwtString, { expiresIn: "60 minutes" }); //token valid for: 
    return user[0];
}


//register
async function addUser(newUser) {
    if (newUser) {
        const checkedUser = new User(newUser);
        const errors = checkedUser.validate(); //check if info is correctly inserted
        if (errors) {
            return errors;
        }
        const sqlCmd = "INSERT INTO `customers`(`first_name`, `last_name`, `email`, `id`, `pass`, `city`, `street`) VALUES ('" +
            checkedUser.first_name + "','" + checkedUser.last_name + "','" + checkedUser.email + "','" + checkedUser.id +
            "','" + checkedUser.pass + "','" + checkedUser.city + "','" + checkedUser.street + "')";
        await dal.executeQueryAsync(sqlCmd);
        return "";
    }
    else {
        return false;
    }
}

//register - check if username is already exist
async function getExistId(id) {
    const sqlCmd = "SELECT * FROM `customers` WHERE `id`= '" + id + "'";
    let idExist = await dal.executeQueryAsync(sqlCmd);
    return idExist;
}

async function getExistEmail(email) {
    const sqlCmd = "SELECT * FROM `customers` WHERE `email`='" + email + "'";
    let emailExist = await dal.executeQueryAsync(sqlCmd);
    return emailExist;
}

//not exported function to check new user details for registration
/* function findErrors(newUser) {
    const errors = {};
    if (!newUser.firstName)
        errors.firstName = "User's first name is missing";
    else if (newUser.firstName.length < 2)
        errors.firstName = "User's first name is too short (min 2 characters)";
    else if (newUser.firstName.length > 20)
        errors.firstName = "User's first name is too long (max 20 characters)";
 
    if (!newUser.lastName)
        errors.lastName = "User's last name is missing";
    else if (newUser.lastName.length < 2)
        errors.lastName = "User's last name is too short (min 2 characters)";
    else if (newUser.lastName.length > 20)
        errors.lastName = "User's last name is too long (max 20 characters)";
 
    if (!newUser.username)
        errors.username = "Username is missing";
    else if (newUser.username.length < 4)
        errors.username = "Username is too short (min 4 characters)";
    else if (newUser.username.length > 10)
        errors.username = "Username is too long (max 10 characters)";
 
    if (!newUser.password)
        errors.password = "Password is missing";
    else if (newUser.password.length < 6)
        errors.password = "Password is too short (min 6 characters)";
    else if (newUser.password.length > 12)
        errors.password = "Password is too long (max 12 characters)";
 
    const errorsLength = Object.keys(errors).length;
    if (errorsLength <= 0)
        return null;
    else
        return errors;
}
 */
module.exports = {
    loginAsync, getExistId, getExistEmail, addUser  /* addUser */
}