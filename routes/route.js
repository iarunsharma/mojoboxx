const express = require('express');
const router = express.Router()


const userController = require("../controllers/employeeController");
const validator = require("../middlewares/validator");
const mid = require('../middlewares/appMiddleware')

router.post("/employee", validator.checkEmployee, userController.createEmployee);

router.post("/login", userController.login);

router.get("/employee", userController.getEmployee);

router.put("/employee/:userId",mid.mw, validator.updateEmployee, userController.employeeUpdate);

router.delete("/employee/:userId",mid.mw, userController.deleteEmployee);

module.exports = router