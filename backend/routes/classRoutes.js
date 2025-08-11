const express = require("express");
const {
  createClass,
  verifyClassCode,
  getClasses,
  deleteClass
} = require("../controllers/classController");

const router = express.Router();

router.post("/classCode", createClass);
router.post("/verifyClassCode", verifyClassCode);
router.get("/classCode", getClasses);
router.delete("/:classId", deleteClass);

module.exports = router;