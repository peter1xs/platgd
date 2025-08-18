import React from 'react'

function CoursesTab() {
  return (
    <>
     {activeTab === "courses" && (
            <div className="student-courses-grid">
              
              <div className="student-courses">
                {courses.map((course) => (
                  <div
                    key={course._id || course.id}
                    className="student-animated-course-card"
                    onClick={() => handleCourseClick(course)}
                  >
                    <div className="card-image-box">
                      <img
                        src={course.courseIcon}
                        alt={course.courseName}
                        className="card-image"
                      />
                      <div  
                        className="card-progress"
                        style={{
                          width:
                            course.status === "completed"
                              ? "100%"
                              : course.status === "enrolled"
                              ? "50%"
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <h3 className="card-title">{course.courseName}</h3>
                    <div className="card-badges">
                      <span
                        className={`student-badge status ${course.status.toLowerCase()}`}
                      >
                        {course.status}
                      </span>
                      <span className="student-badge code"> {course.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
    </>
  )
}

export default CoursesTab