const employeeModel = require("../models/employeeModel");
const jwt = require("jsonwebtoken");
const validator = require("../middlewares/validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//======================== Create employee =================================================================================//

const createEmployee = async function (req, res) {
  try {
    let requestBody = req.body;
    let { employeeName, age, email, password, department } = requestBody;
    password = await bcrypt.hash(password, saltRounds);
    const employeeData = { employeeName, age, email, password, department };
    const employee = await employeeModel.create(employeeData);
    res.status(201).send({
      status: true,
      message: "employee created sucessfully",
      data: employee,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, data: err.message });
  }
};

//======================== log in employee =================================================================================//

// const login = async function (req, res) {
//   try {
//     const requestBody = req.body;
//     if (!validator.isvalidRequestBody(requestBody)) {
//       return res
//         .status(400)
//         .send({ status: false, msg: "please provide data to signIn" });
//     }
//     const { email, password } = requestBody;

//     if (!validator.isvalid(email)) {
//       return res
//         .status(400)
//         .send({ status: false, msg: "please provide email" });
//     }

//     if (!validator.isValidSyntaxOfEmail(email)) {
//       return res
//         .status(400)
//         .send({ status: false, msg: "please provide valid email" });
//     }

//     if (!validator.isvalid(password)) {
//       return res
//         .status(400)
//         .send({ status: false, msg: "please provide password" });
//     }

//     const findEmail = await employeeModel.findOne({ email });
//     if (!findEmail) {
//       return res
//         .status(400)
//         .send({ status: false, msg: "employee does'nt exist with this email" });
//     }

//     let hashedPassword = findEmail.password;

//     const encryptedPassword = await bcrypt.compare(password, hashedPassword);

//     if (!encryptedPassword)
//       return res
//         .status(401)
//         .send({ status: false, message: `Invalid login credentials` });

//     let payload = {  email: email ,userId:_id };
//     const generateToken = jwt.sign(payload, "mojoboxx");
//     res.status(200).send({
//       msg: "Employee login sucessfully",
//       data: { userId: findEmail._id, token: generateToken },
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ status: false, data: err.message });
//   }
// };



const login = async (req, res) => {
  try {
      const Email = req.body.email
      const Password = req.body.password

      let user = await employeeModel.findOne({ email: Email });
      if (user) {
          const { _id, password } = user
          const validPassword = await bcrypt.compare(Password, password);
          if (!validPassword) {
              return res.status(400).send({ message: "Invalid Password" })
          }
          let payload = { userId: _id, email: Email };
          const generatedToken = jwt.sign(payload, "mojoboxx");
          res.header('user-login-key', generatedToken);
          return res.status(200).send({ status: true, data: { userId: user._id, token: generatedToken } });
      } else {
          return res.status(401).send({ status: false, message: "Invalid credentials" });
      }
  } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
  }
};

//======================== GET users =================================================================================//

const getEmployee = async function (req, res) {
  try {
    let employee = await employeeModel.find({ isDeleted: false });
    res
      .status(200)
      .send({ status: true, message: "employee list", data: employee });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, error: error.message });
  }
};

//======================== UPDATE users =================================================================================//

const employeeUpdate = async function (req, res) {
  try {
    let decodedId = req.userId;
    let userId = req.params.userId;
    let requestBody = req.body;
    let checkId = validator.isValidObjectId(userId);
    if (!checkId) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Valid User Id" });
    }

    const searchUser = await employeeModel.findOne({ _id: userId });

    if (!searchUser) {
      return res
        .status(404)
        .send({ status: false, message: "employee does not exist" });
    }

    if (!decodedId === userId) {
      return res.status(401).send({ status: false, msg: "unauthorized access" });
    }

    let { employeeName, age, email, password, department } = requestBody;

    let encryptedPassword = await bcrypt.hash(password, saltRounds);

    const updateData = {
      employeeName,
      age,
      email,
      password: encryptedPassword,
      department,
    };

    const result = await employeeModel.findOneAndUpdate(
      { _id: userId },
      updateData,
      { new: true }
    );
    res.status(200).send({
      status: true,
      message: "employee updated sucessfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, error: error.message });
  }
};

//================== DELETE user ===========================================================================================//

const deleteEmployee = async function (req, res) {
  try {
    let decodedId = req.userId;
    console.log(decodedId)
    let userId = req.params.userId;
    console.log(userId)
    let checkid = validator.isValidObjectId(userId);
    if (!checkid) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid userId " });
    }
  
    let checkemployee = await employeeModel.findOne({ _id: userId });
    if (!checkemployee) {
      return res.status(404).send({
        status: false,
        message: "employee not found or already deleted",
      });
    }

    if (decodedId !== userId) {
      return res.status(401).send({ status: false, msg: "unauthorized access" });
     }

    let updatedEmployee = await employeeModel.findOneAndUpdate(
      { _id: userId },
      { $set: { isDeleted: true } },
      { new: true }
    );
    res.status(200).send({
      status: true,
      message: "sucessfully deleted",
      data: updatedEmployee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = {
  createEmployee,
  login,
  getEmployee,
  employeeUpdate,
  deleteEmployee,
};
