import React, { useState, useEffect } from 'react';
// import './SchoolsManagement.css';

const SchoolsManagement = ({ tutorId }) => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showSchoolDetails, setShowSchoolDetails] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, [tutorId]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutor-dashboard/schools/${tutorId}`);
      const data = await response.json();
      
      if (data.success) {
        setSchools(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolClick = async (schoolId) => {
    try {
      const response = await fetch(`/api/tutor-dashboard/schools/${tutorId}/${schoolId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedSchool(data.data);
        setShowSchoolDetails(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch school details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="schools-loading">
        <div className="loading-spinner"></div>
        <p>Loading schools...</p>
      </div>
    );
  }

  return (
    <div className="schools-management">
      <div className="schools-header">
        <h2>Schools Management</h2>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Schools List */}
      <div className="schools-list">
        {schools.length > 0 ? (
          schools.map((school) => (
            <div 
              key={school._id} 
              className="school-card"
              onClick={() => handleSchoolClick(school._id)}
            >
              <div className="school-header">
                <div className="school-icon">🏫</div>
                <div className="school-info">
                  <h3>{school.name}</h3>
                  <p className="school-code">Code: {school.code}</p>
                  <p className="school-location">{school.location}</p>
                </div>
              </div>
              
              <div className="school-stats">
                <div className="stat-item">
                  <span className="stat-number">{school.classes?.length || 0}</span>
                  <span className="stat-label">Classes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{school.studentsCount || 0}</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{school.classes?.reduce((total, cls) => total + (cls.students?.length || 0), 0) || 0}</span>
                  <span className="stat-label">Enrolled</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-schools">
            <p>No schools assigned to you.</p>
          </div>
        )}
      </div>

      {/* School Details Modal */}
      {showSchoolDetails && selectedSchool && (
        <div className="school-details-overlay">
          <div className="school-details-modal">
            <div className="modal-header">
              <h3>School Details - {selectedSchool.name}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowSchoolDetails(false);
                  setSelectedSchool(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="school-details-content">
              <div className="school-profile">
                <div className="school-icon large">🏫</div>
                <div className="school-info">
                  <h2>{selectedSchool.name}</h2>
                  <p className="school-code">School Code: {selectedSchool.code}</p>
                  <p className="school-location">{selectedSchool.location}</p>
                </div>
              </div>

              <div className="school-stats-overview">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-content">
                    <h3>{selectedSchool.classes?.length || 0}</h3>
                    <p>Total Classes</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>{selectedSchool.studentsCount || 0}</h3>
                    <p>Total Students</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h3>{formatDate(selectedSchool.createdAt)}</h3>
                    <p>Established</p>
                  </div>
                </div>
              </div>

              {/* Classes Section */}
              <div className="classes-section">
                <h4>Classes</h4>
                <div className="classes-list">
                  {selectedSchool.classes?.length > 0 ? (
                    selectedSchool.classes.map((cls) => (
                      <div key={cls._id} className="class-item">
                        <div className="class-header">
                          <h5>{cls.name}</h5>
                          <span className="class-level">{cls.level}</span>
                        </div>
                        <div className="class-details">
                          <p><strong>Students:</strong> {cls.students?.length || 0}</p>
                          <p><strong>Schedule:</strong> {cls.schedule?.dayOfWeek} {cls.schedule?.startTime} - {cls.schedule?.endTime}</p>
                          {cls.tutor && (
                            <p><strong>Tutor:</strong> {cls.tutor.fname} {cls.tutor.lname}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No classes found.</p>
                  )}
                </div>
              </div>

              {/* Students Section */}
              <div className="students-section">
                <h4>Recent Students</h4>
                <div className="students-list">
                  {selectedSchool.students?.slice(0, 5).map((student) => (
                    <div key={student._id} className="student-item">
                      <div className="student-avatar">
                        {student.profileImage ? (
                          <img src={student.profileImage} alt={student.fullName} />
                        ) : (
                          <div className="avatar-placeholder small">
                            {student.fname?.charAt(0)}{student.lname?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="student-info">
                        <h5>{student.fname} {student.lname}</h5>
                        <p>{student.class?.name} • {student.grade}</p>
                      </div>
                      <div className="student-status">
                        <span className={`status-badge ${student.status}`}>
                          {student.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!selectedSchool.students || selectedSchool.students.length === 0) && (
                    <p>No students found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolsManagement;

