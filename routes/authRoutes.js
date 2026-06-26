const express = require("express");

const {
    sendOTP,
    verifyOTP
} = require("../controllers/authController");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Auth API Working");
});

router.post("/send", sendOTP);

router.post("/verify", verifyOTP);

module.exports = router;