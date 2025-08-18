import React, { useState, useEffect } from "react";
import "./StudentProfile.css";
import axios from "axios";

function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [courseStats, setCourseStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    certificates: 0
  });

  useEffect(() => {
    const fetchStudentAndCourseData = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) throw new Error("No student ID found");

        // Fetch student data
        const studentResponse = await axios.get(
          `https://platform-zl0a.onrender.com/cobotKidsKenya/students/${studentId}`
        );

        if (!studentResponse.data.success) {
          throw new Error(studentResponse.data.error || "Failed to fetch student data");
        }

        setStudentData(studentResponse.data.student);
        setAvatarUrlInput(studentResponse.data.student?.profileImage || "");

        // Fetch all courses from the database
        const coursesResponse = await axios.get(
          `https://platform-zl0a.onrender.com/cobotKidsKenya/courses`
        );

        if (coursesResponse.data.success) {
          setCourseData(coursesResponse.data.courses);
          
          // Filter courses for this student (assuming courses have studentId field)
          const studentCourses = coursesResponse.data.courses.filter(
            course => course.studentId === studentId
          );

          // Calculate statistics
          const completed = studentCourses.filter(c => c.status === "completed").length;
          const inProgress = studentCourses.filter(c => c.status === "enrolled").length;
          
          setCourseStats({
            total: studentCourses.length,
            completed,
            inProgress,
            certificates: completed // or completed + inProgress depending on your logic
          });
        }

      } catch (err) {
        setError(
          err.response?.data?.error ||
          err.message ||
          "Error fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndCourseData();
  }, []);

  
  if (loading) {
    return <div className="loading-message">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!studentData) {
    return <div className="no-data-message">No student data available</div>;
  }

  // Calculate attendance percentage
  const calculateAttendance = () => {
    if (!studentData.attendanceRecords) return "N/A";
    const total = studentData.attendanceRecords.length;
    const present = studentData.attendanceRecords.filter(r => r.status === "present").length;
    return `${Math.round((present / total) * 100)}%`;
  };

  const handleAvatarClick = () => {
    setIsEditingAvatar(true);
  };

  const handleSaveAvatar = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) throw new Error("No student ID found");
      setSavingAvatar(true);
      const res = await axios.put(
        `https://platform-zl0a.onrender.com/cobotKidsKenya/students/${studentId}`,
        { profileImage: avatarUrlInput?.trim() || null }
      );
      if (res.data?.success) {
        setStudentData(prev => ({ ...prev, profileImage: avatarUrlInput?.trim() || null }));
        setIsEditingAvatar(false);
      } else {
        throw new Error(res.data?.error || "Failed to update avatar");
      }
    } catch (e) {
      alert(e.message || "Failed to save avatar");
    } finally {
      setSavingAvatar(false);
    }
  };

  return (
    <div className="student-profile-card">
      <div className="student-profile-info">
        <div className="student-profile-pic" onClick={handleAvatarClick}>
          {studentData.profileImage ? (
            <img src={studentData.profileImage} alt="Avatar" className="student-avatar-img" />
          ) : (
            <i className="fas fa-user-astronaut student-profile-icon"></i>
          )}
          <div className="student-upload-indicator">
            <i className="fas fa-camera"></i>
          </div>
          <div className="student-profile-text">{studentData.profileImage ? 'Change Photo' : 'Add Photo'}</div>
          {isEditingAvatar && (
            <div className="avatar-input-overlay" onClick={e => e.stopPropagation()}>
              <input
                type="url"
                placeholder="Paste image URL"
                value={avatarUrlInput}
                onChange={e => setAvatarUrlInput(e.target.value)}
                className="avatar-url-input"
              />
              <div className="avatar-actions">
                <button className="avatar-btn save" onClick={handleSaveAvatar} disabled={savingAvatar}>
                  {savingAvatar ? 'Saving...' : 'Save'}
                </button>
                <button className="avatar-btn cancel" onClick={() => setIsEditingAvatar(false)} disabled={savingAvatar}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="student-profile-info-text">
          <h1 className="student-profile-name">
            {studentData.fname} {studentData.lname}
          </h1>
          <h5 className="student-profile-grade">
            {studentData.className || "Class Not Available"}
          </h5>
          <p className="student-profile-bio">
            <strong>School:</strong> {studentData.schoolName || "N/A"} <br />
            <strong>Username:</strong> {studentData.username}
          </p>
          <div className="student-profile-stats">
            <span className="student-stat-item">
              <i className="fas fa-star stat-icon"></i>
              {studentData.points || 0} Points
            </span>
            <span className="student-stat-item">
              <i className="fas fa-calendar-alt stat-icon"></i>
              Joined {new Date(studentData.createdAt).toLocaleDateString()}
            </span>
            <span className="student-stat-item">
              <i className="fas fa-calendar-check stat-icon"></i>
              Attendance: {calculateAttendance()}
            </span>
            {studentData.performance && (
              <span className="student-stat-item">
                <i className="fas fa-chart-line stat-icon"></i>
                Performance: {studentData.performance}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="student-courses-profile">
        <div className="student-course-item">
          <h1 className="student-course-count">
            {courseStats.total}
          </h1>
          <h4 className="student-course-label">Total Courses</h4>
        </div>
        <div className="student-course-item">
          <h1 className="student-course-count">
            {courseStats.completed}
          </h1>
          <h4 className="student-course-label">Completed</h4>
        </div>
        <div className="student-course-item">
          <h1 className="student-course-count">
            {courseStats.inProgress}
          </h1>
          <h4 className="student-course-label">In Progress</h4>
        </div>
        <div className="student-course-item">
          <h1 className="student-course-count">
            {courseStats.certificates}
          </h1>
          <h4 className="student-course-label">Certificates</h4>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;