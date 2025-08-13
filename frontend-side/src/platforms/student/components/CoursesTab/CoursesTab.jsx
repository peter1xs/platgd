import React, { useState, useEffect } from "react";
import "./StudentProfile.css";
import axios from "axios";

// New CourseCard component
const CourseCard = ({ course, onClick }) => {
  const getStatusColor = () => {
    switch (course.status) {
      case "completed":
        return "bg-green-500";
      case "enrolled":
        return "bg-yellow-500";
      case "locked":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  const isDisabled = course.status === "locked";

  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
        isDisabled ? "opacity-60 grayscale" : "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      }`}
      onClick={!isDisabled ? onClick : undefined}
    >
      {/* Status badge */}
      <span
        className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor()}`}
      >
        {course.status.toUpperCase()}
      </span>

      {/* Course image */}
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-500">
            <i className="fas fa-book-open text-4xl"></i>
          </div>
        )}
      </div>

      {/* Course info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{course.name}</h3>
        <p className="text-gray-600 text-sm">{course.code}</p>
      </div>
    </div>
  );
};

function StudentsProfile() {
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) throw new Error("No student ID found");

        const [studentRes, coursesRes] = await Promise.all([
          axios.get(`https://platform-zl0a.onrender.com/cobotKidsKenya/students/${studentId}`),
          axios.get(`https://platform-zl0a.onrender.com/cobotKidsKenya/students/${studentId}/courses`)
        ]);

        if (!studentRes.data.success || !coursesRes.data.success) {
          throw new Error("Failed to fetch data");
        }

        setStudentData(studentRes.data.student);
        setCourses(coursesRes.data.courses);

      } catch (err) {
        setError(err.response?.data?.error || err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseClick = (course) => {
    if (course.status !== "locked") {
      setSelectedCourse(course);
      // You can add additional logic here, like navigating to course details
      console.log("Selected course:", course);
    }
  };

  // Calculate statistics
  const courseStats = {
    total: courses.length,
    completed: courses.filter(c => c.status === "completed").length,
    inProgress: courses.filter(c => c.status === "enrolled").length,
    certificates: courses.filter(c => c.status === "completed").length
  };

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!studentData) return <div className="no-data-message">No student data available</div>;

  return (
    <div className="student-profile-container">
      {/* Profile header (same as before) */}
      <div className="student-profile-header">
        {/* ... existing profile header code ... */}
      </div>

      {/* Courses section */}
      <div className="courses-section">
        <h2 className="section-title">My Courses</h2>
        
        {/* Course statistics */}
        <div className="course-stats">
          {/* ... existing stats code ... */}
        </div>

        {/* Course grid */}
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onClick={() => handleCourseClick(course)}
            />
          ))}
        </div>
      </div>

      {/* Course modal (optional) */}
      {selectedCourse && (
        <div className="course-modal">
          <div className="modal-content">
            <h3>{selectedCourse.name}</h3>
            <p>Code: {selectedCourse.code}</p>
            <button onClick={() => setSelectedCourse(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsProfile;