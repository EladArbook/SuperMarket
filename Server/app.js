const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const config = require('./configuration');
const authController = require('./controller-layer/auth-controller');
const userController = require('./controller-layer/user-controller');
const adminController = require('./controller-layer/admin-controller');

app.use(config.authApi, authController);
app.use(config.userApi, userController);
app.use(config.adminApi, adminController);

app.use("*", (req, res) => {
    res.status(404).send(`Route not found ${req.originalUrl}`);
});

app.listen(config.port, () => {
    console.log("🚀 Listening on " + config.port);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE")
        console.log("Error: Port in use");
    else
        console.log("Error: Unknown error");
});