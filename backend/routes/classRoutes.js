const express = require("express");
const {
  createClass,
  verifyClassCode,
  getClasses,
  deleteClass
} = require("../controllers/classController");

// Debug: Check what's being imported
const controller = require("../controllers/classController");
console.log('Available exports from controller:', Object.keys(controller));
console.log('createClass type:', typeof controller.createClass);
console.log('verifyClassCode type:', typeof controller.verifyClassCode);
console.log('getClasses type:', typeof controller.getClasses);
console.log('deleteClass type:', typeof controller.deleteClass);

const router = express.Router();

router.post("/classCode", createClass);
router.post("/verifyClassCode", verifyClassCode);
router.get("/classCode", getClasses);
router.delete("/:classId", deleteClass);

module.exports = router;