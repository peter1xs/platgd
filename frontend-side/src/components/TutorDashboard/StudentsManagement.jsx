import React, { useState, useEffect } from 'react';
import './StudentsManagement.css';

const StudentsManagement = ({ tutorId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [filters, setFilters] = useState({
    classId: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [tutorId, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.classId) queryParams.append('classId', filters.classId);
      if (filters.status) queryParams.append('status', filters.status);
      
      const response = await fetch(`/api/tutor-dashboard/students/${tutorId}?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        let filteredStudents = data.data;
        
        // Apply search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredStudents = filteredStudents.filter(student => 
            student.fname.toLowerCase().includes(searchTerm) ||
            student.lname.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm)
          );
        }
        
        setStudents(filteredStudents);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = async (studentId) => {
    try {
      const response = await fetch(`/api/tutor-dashboard/students/${tutorId}/${studentId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedStudent(data.data);
        setShowStudentDetails(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch student details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="students-loading">
        <div className="loading-spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="students-management">
      <div className="students-header">
        <h2>Students Management</h2>
        <div className="students-filters">
          <input
            type="text"
            placeholder="Search students..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="search-input"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Students List */}
      <div className="students-list">
        {students.length > 0 ? (
          students.map((student) => (
            <div 
              key={student._id} 
              className="student-card"
              onClick={() => handleStudentClick(student._id)}
            >
              <div className="student-avatar">
                {student.profileImage ? (
                  <img src={student.profileImage} alt={student.fullName} />
                ) : (
                  <div className="avatar-placeholder">
                    {student.fname?.charAt(0)}{student.lname?.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="student-info">
                <h3>{student.fname} {student.lname}</h3>
                <p className="student-email">{student.email}</p>
                <div className="student-meta">
                  <span className="meta-item">
                    <strong>Class:</strong> {student.class?.name}
                  </span>
                  <span className="meta-item">
                    <strong>Grade:</strong> {student.grade}
                  </span>
                  <span className="meta-item">
                    <strong>Age:</strong> {calculateAge(student.dateOfBirth)}
                  </span>
                </div>
                <div className="student-status">
                  <span className={`status-badge ${student.status}`}>
                    {student.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-students">
            <p>No students found.</p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="student-details-overlay">
          <div className="student-details-modal">
            <div className="modal-header">
              <h3>Student Details</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowStudentDetails(false);
                  setSelectedStudent(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="student-details-content">
              <div className="student-profile">
                <div className="profile-avatar">
                  {selectedStudent.profileImage ? (
                    <img src={selectedStudent.profileImage} alt={selectedStudent.fullName} />
                  ) : (
                    <div className="avatar-placeholder large">
                      {selectedStudent.fname?.charAt(0)}{selectedStudent.lname?.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="profile-info">
                  <h2>{selectedStudent.fname} {selectedStudent.lname}</h2>
                  <p className="student-email">{selectedStudent.email}</p>
                  <p className="student-username">Username: {selectedStudent.username}</p>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-item">
                    <strong>Date of Birth:</strong> {formatDate(selectedStudent.dateOfBirth)}
                  </div>
                  <div className="detail-item">
                    <strong>Age:</strong> {calculateAge(selectedStudent.dateOfBirth)} years
                  </div>
                  <div className="detail-item">
                    <strong>Gender:</strong> {selectedStudent.gender}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {selectedStudent.phone || 'Not provided'}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Academic Information</h4>
                  <div className="detail-item">
                    <strong>School:</strong> {selectedStudent.school?.name}
                  </div>
                  <div className="detail-item">
                    <strong>Class:</strong> {selectedStudent.class?.name}
                  </div>
                  <div className="detail-item">
                    <strong>Grade:</strong> {selectedStudent.grade}
                  </div>
                  <div className="detail-item">
                    <strong>Enrollment Date:</strong> {formatDate(selectedStudent.enrollmentDate)}
                  </div>
                  <div className="detail-item">
                    <strong>GPA:</strong> {selectedStudent.academicInfo?.gpa || 'Not available'}
                  </div>
                  <div className="detail-item">
                    <strong>Attendance Rate:</strong> {selectedStudent.academicInfo?.attendanceRate || 0}%
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Additional Information</h4>
                  <div className="detail-item">
                    <strong>Points:</strong> {selectedStudent.points}
                  </div>
                  <div className="detail-item">
                    <strong>Learning Style:</strong> {selectedStudent.preferences?.learningStyle || 'Not specified'}
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge ${selectedStudent.status}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>

                {selectedStudent.emergencyContact && (
                  <div className="detail-section">
                    <h4>Emergency Contact</h4>
                    <div className="detail-item">
                      <strong>Name:</strong> {selectedStudent.emergencyContact.name}
                    </div>
                    <div className="detail-item">
                      <strong>Relationship:</strong> {selectedStudent.emergencyContact.relationship}
                    </div>
                    <div className="detail-item">
                      <strong>Phone:</strong> {selectedStudent.emergencyContact.phone}
                    </div>
                    <div className="detail-item">
                      <strong>Email:</strong> {selectedStudent.emergencyContact.email}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;

