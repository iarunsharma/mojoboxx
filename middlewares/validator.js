const mongoose = require("mongoose");
const employeeModel = require("../models/employeeModel");
const validator = require("email-validator");



const isvalid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.length === 0) return false;
  return true;
};

const isvalidRequestBody = function (requestbody) {
  return Object.keys(requestbody).length > 0;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidSyntaxOfEmail = function (value) {
  if (!validator.validate(value)) {
    return false;
  }
  return true;
};

const validAge = function isInteger(value) {
  if (value < 0) return false;
  if (value % 1 == 0) return true;
};

//--------------------------------------------------------------------------------------------------------------------//

const checkEmployee = async (req, res, next) => {
  try {
    let requestBody = req.body;
    if (!isvalidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Provide Data" });
    }
    let { employeeName, age, email, password, department } = requestBody;

    if (!isvalid(employeeName)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill the employeeName " });
    }

    if (!validAge(age)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill the valid age " });
    }

    if (!isvalid(email)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill the email" });
    }

    if (!isValidSyntaxOfEmail(email)) {
      return res
        .status(404)
        .send({ status: false, message: "Please provide a valid Email Id" });
    }
    const isEmailAlreadyUsed = await employeeModel.findOne({ email });

    if (isEmailAlreadyUsed) {
      return res.status(400).send({
        status: false,
        message: `${email} email address is already registered`,
      });
    }

    if (!isvalid(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill the password" });
    }

    if (!isvalid(department)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill the department" });
    }
  


    next();
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

//==================================================================================================================//

const updateEmployee = async function (req, res, next) {
  try {
    let userBody = req.body;
    if (!isvalidRequestBody(userBody)) {
      return res
        .status(400)
        .send({ status: true, message: "Please provide data" });
    }

    const { employeeName, email, password, department } = userBody;

if(employeeName){
  if (!isvalid(employeeName)) {
    return res
      .status(400)
      .send({ status: false, msg: "Please fill the employeeName " });
  }
}

    if (email) {
      if (!isvalid(email)) {
        return res
          .status(400)
          .send({ status: false, msg: "Please fill the email" });
      }

      if (!isValidSyntaxOfEmail(email)) {
        return res
          .status(404)
          .send({ status: false, message: "Please provide a valid Email Id" });
      }
      const isEmailAlreadyUsed = await employeeModel.findOne({ email });

      if (isEmailAlreadyUsed) {
        return res.status(400).send({
          status: false,
          message: `${email} email address is already registered`,
        });
      }
    }

    if (password) {
      if (!isvalid(password)) {
        return res
          .status(400)
          .send({ status: false, msg: "Please fill the password" });
      }
    
    }

    if (department) {
      if (!isvalid(department)) {
        return res
          .status(400)
          .send({ status: false, msg: "Please fill the department" });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, error: error.message });
  }
};

//-------------------------------------------------------------------------------------------------------------------//

module.exports = {
  isvalid,
  isvalidRequestBody,
  isValidSyntaxOfEmail,
  isValidObjectId,
  checkEmployee,
  updateEmployee,
};
