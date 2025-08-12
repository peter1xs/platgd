import React from 'react'
import "./TutorProfile.css";
import axios from "axios";
function TutorProfile() {
  return (
    <div className="student-profile-card">
      <div className="student-profile-info">
        <div class="student-profile-pic">
          <i class="fas fa-user-astronaut student-profile-icon"></i>
          <div class="student-upload-indicator">
            <i class="fas fa-camera"></i>
          </div>
          <div class="student-profile-text">Add Photo</div>
        </div>

        <div className="student-profile-info-text">
          <h1 className="student-profile-name">
            Fredric
          </h1>
          <h5 className="student-profile-grade">
           Level
          </h5>
          <p className="student-profile-bio">
            teacher Tom
          </p>
          <div className="student-profile-stats">
            <span className="student-stat-item">
              <i className="fas fa-star stat-icon"></i>
               Earnings
            </span>
            <span className="student-stat-item">
              <i className="fas fa-calendar-alt stat-icon"></i>
              Joined 
            </span>
          </div>
        </div>
      </div>
      <div class="student-courses-profile">
        <div class="student-course-item">
          <h1 class="student-course-count">12</h1>
          <h4 class="student-course-label">Total Courses</h4>
        </div>
        <div class="student-course-item">
          <h1 class="student-course-count">0</h1>
          <h4 class="student-course-label">Completed</h4>
        </div>
        <div class="student-course-item">
          <h1 class="student-course-count">1</h1>
          <h4 class="student-course-label">In Progress</h4>
        </div>
        <div class="student-course-item">
          <h1 class="student-course-count">0</h1>
          <h4 class="student-course-label">Certificates</h4>
        </div>
      </div>
    </div>
  )
}

export default TutorProfile