const express = require("express");
const router = express.Router();
const controller = require("../controllers/methods")
router.get("/getCode", controller.getCode);
router.post("/runCode", controller.runCode);
router.post("/saveCode", controller.saveCode);
module.exports = router;
