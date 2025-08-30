const express = require("express");
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addTopicToCourse,
  getCourseTopics
} = require("../controllers/courseController");

const router = express.Router();

router.route("/")
  .get(getCourses)
  .post(createCourse);

router.route("/:id")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

// Topic routes
router.post("/:courseId/topics", addTopicToCourse);
router.get("/:courseId/topics", getCourseTopics);

module.exports = router;