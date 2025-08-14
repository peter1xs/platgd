import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ComingSoon  from "../../components/comingSoon/ComingSoon"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faBookOpen, 
  faLink, 
  faBuilding, 
  faUsers, 
  faKey,
  faChartLine,
  faStar,
  faExclamationCircle,
  faCalendarAlt,
  faArrowRight,
  faSearch,
  faFilter,
  faSort,
  faSortAmountDown,
  faUndo,
  faEllipsisV,
  faUserGraduate,
  faSchool,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';
import './styles/TutorDashboard.css';

function TutorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');  
  const [showSelfRegistration, setShowSelfRegistration] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState('');
  const [recentCodes, setRecentCodes] = useState({});
  const [tutorDetails, setTutorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Student management state
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [schoolsList, setSchoolsList] = useState([]);
  const [classesList, setClassesList] = useState([]);

  // Fetch tutor details and assignments
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const profileRaw = localStorage.getItem('tutor_profile');
        if (!profileRaw) throw new Error('No tutor profile found');
        
        const profile = JSON.parse(profileRaw);
        const tutorId = profile?.id;
        if (!tutorId) throw new Error('No tutor ID found');

        // Fetch tutor details
        const tutorResponse = await axios.get(`https://platform-zl0a.onrender.com/cobotKidsKenya/tutors/${tutorId}`);
        setTutorDetails(tutorResponse.data.data || null);

        // Fetch assignments
        setAssignmentsLoading(true);
        const assignmentsResponse = await axios.get(`https://platform-zl0a.onrender.com/cobotKidsKenya/tutors/${tutorId}/assignments`);
        setAssignments(Array.isArray(assignmentsResponse.data.data) ? assignmentsResponse.data.data : []);

        // Fetch students
        setLoadingStudents(true);
        const studentsResponse = await axios.get(`https://platform-zl0a.onrender.com/tutor/${tutorId}/assignments/${classId}/students`);
        setStudents(studentsResponse.data.data || []);

        // Extract unique schools and classes
        const schools = [...new Set(studentsResponse.data.data.map(s => ({
          id: s.schoolId,
          name: s.schoolName
          
        })))];
        
        const classes = [...new Set(studentsResponse.data.data.map(s => ({
          id: s.classId,
          name: s.className,
          schoolId: s.schoolId
        })))];
        
        setSchoolsList(schools);
        setClassesList(classes);
        
        // Set initial filters if data exists
        if (schools.length > 0) {
          setSelectedSchoolId(schools[0].id);
        }
        if (classes.length > 0) {
          setSelectedClassId(classes[0].id);
        }

      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch tutor data:", err);
      } finally {
        setLoading(false);
        setAssignmentsLoading(false);
        setLoadingStudents(false);
      }
    };

    fetchTutorData();
  }, []);

  // Filter and sort students
  const filteredStudents = students.filter(student => {
    const matchesSchool = selectedSchoolId ? student.schoolId === selectedSchoolId : true;
    const matchesClass = selectedClassId ? student.classId === selectedClassId : true;
    const matchesSearch = searchQuery 
      ? student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        student.username.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesPerformance = performanceFilter !== 'all' 
      ? student.performance === performanceFilter 
      : true;
    
    return matchesSchool && matchesClass && matchesSearch && matchesPerformance;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'performance') {
      return sortOrder === 'asc' 
        ? a.performance.localeCompare(b.performance) 
        : b.performance.localeCompare(a.performance);
    } else if (sortBy === 'lastLogin') {
      return sortOrder === 'asc' 
        ? new Date(a.lastLogin) - new Date(b.lastLogin)
        : new Date(b.lastLogin) - new Date(a.lastLogin);
    }
    return 0;
  });

  // Dashboard stats
  const dashboardStats = {
    students: students.length,
    schools: assignments.length || 0,
    classes: assignments.reduce((sum, a) => sum + (a.classes?.length || 0), 0) || 0,
    rating: 0
  };

  const handleResetPassword = async (studentId) => {
    if (window.confirm('Are you sure you want to reset this student\'s password?')) {
      try {
        const response = await axios.post(
          `https://platform-zl0a.onrender.com/cobotKidsKenya/students/${studentId}/resetPassword`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (response.data.success) {
          alert('Password reset successful! New temporary password: ' + response.data.data.tempPassword);
        } else {
          throw new Error(response.data.error || 'Failed to reset password');
        }
      } catch (err) {
        alert(err.message || 'Failed to reset password');
        console.error("Password reset error:", err);
      }
    }
  };


 const generateSelfRegistrationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setShowSelfRegistration(true);
    // In a real app, this would be sent to the backend
    alert(`Generated Code: ${code}`);
  };

  const handleGenerateClassCode = async (schoolId, classId) => {
    try {
      const res = await axios.post(
        `https://platform-zl0a.onrender.com/cobotKidsKenya/schools/${schoolId}/classes/${classId}/generateCode`, 
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const payload = res?.data?.data;
      if (payload?.code) {
        setRecentCodes(prev => ({ ...prev, [classId]: { code: payload.code, validUntil: payload.validUntil } }));
        alert(`Class code for ${payload.className} (${payload.schoolName}): ${payload.code}`);
      } else {
        alert('Code generated but response had no code value');
      }
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to generate class code');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSchoolId(schoolsList[0]?.id || '');
    setSelectedClassId(classesList[0]?.id || '');
    setPerformanceFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };
  const renderDashboard = () => (
    <div className="dashboard-overview">
      <h1>Hello {tutorDetails?.fname || 'Tutor'}, Here is an overview of your tutor's dashboard.</h1>
      
      <div className="dashboard-grid">
        {/* Self Registration Card */}
        <div className="dashboard-card self-registration">
          <div className="card-icon">
            <FontAwesomeIcon icon={faKey} />
          </div>
          <h3>Self-Registration</h3>
          <p>Students can use a code to register themselves — no admin needed.</p>
          <button className="generate-code-btn" onClick={generateSelfRegistrationCode}>
            Generate Code
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="metrics-column">
          <div className="metric-card">
            <h4>Number of students</h4>
            <div className="metric-value">{dashboardStats.students}</div>
          </div>
          
          <div className="metric-card">
            <h4>Number of schools</h4>
            <div className="metric-value">{dashboardStats.schools}</div>
          </div>
          
          <div className="metric-card">
            <h4>Number of classes</h4>
            <div className="metric-value">{dashboardStats.classes}</div>
          </div>
          
          <div className="metric-card">
            <h4>Overall Rating</h4>
            <div className="metric-value">{dashboardStats.rating} out of 4</div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="dashboard-card performance-card">
          <h3>Your Overall Performance</h3>
          <p>This shows your overall performance in a school.</p>
          
          <div className="performance-tabs">
            <button className={`tab-btn ${activeTab === 'schools' ? 'active' : ''}`}>
              Schools
            </button>
            <button className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}>
              Students
            </button>
          </div>
          
          <div className="performance-content">
            {/* Performance data would go here */}
          </div>
        </div>

        {/* Quiz Score Card */}
        <div className="dashboard-card quiz-score-card">
          <h3>10 Weekly Average Quiz Score</h3>
          <p>All Courses</p>
          <div className="quiz-content">
            {/* Quiz score data would go here */}
          </div>
        </div>
      </div>
    </div>
  );
  const renderStudents = () => (
    <div className="students-management">
      <h1>Student Management</h1>
      
      <div className="filters-section">
        <div className="filter-row">
          <select 
            value={selectedSchoolId} 
            onChange={(e) => {
              setSelectedSchoolId(e.target.value);
              setSelectedClassId('');
            }}
            className="filter-select"
          >
            <option value="">All Schools</option>
            {schoolsList.map(school => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="filter-select"
            disabled={!selectedSchoolId}
          >
            <option value="">All Classes</option>
            {classesList
              .filter(cls => !selectedSchoolId || cls.schoolId === selectedSchoolId)
              .map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
          </select>
          
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search by name or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-row">
          <select 
            value={performanceFilter} 
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Performances</option>
            <option value="Below Expectation">Below Expectation</option>
            <option value="Meets Expectation">Meets Expectation</option>
            <option value="Exceeds Expectation">Exceeds Expectation</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Name</option>
            <option value="performance">Performance</option>
            <option value="lastLogin">Last Login</option>
          </select>
          
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          
          <button className="reset-btn" onClick={resetFilters}>
            <FontAwesomeIcon icon={faUndo} />
            Reset
          </button>
        </div>
      </div>

      {loadingStudents ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : errorStudents ? (
        <div className="error-message">
          {errorStudents}
        </div>
      ) : (
        <div className="students-table">
          {sortedStudents.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Username</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>Performance Rating</th>
                  <th>Last login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <Link to={`/schools/${student.schoolId}/classes/${student.classId}/students/${student.id}`} className="student-name">
                        {student.name}
                      </Link>
                    </td>
                    <td>{student.gender}</td>
                    <td>{student.username}</td>
                    <td>{student.schoolName}</td>
                    <td>{student.className}</td>
                    <td>
                      <span className={`performance-badge ${student.performance.toLowerCase().replace(' ', '-')}`}>
                        <FontAwesomeIcon icon={faStar} />
                        {student.performance}
                      </span>
                    </td>
                    <td>{student.lastLogin ? new Date(student.lastLogin).toLocaleString() : 'Never'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn reset-password-btn"
                          onClick={() => handleResetPassword(student.id)}
                          title="Reset Password"
                        >
                          <FontAwesomeIcon icon={faKey} />
                        </button>
                        <button className="action-btn more-btn">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <p>No students found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSchools = () => (
    <div className="schools-management">
      <h1>School List</h1>
      <p>Here is a list of all the schools you have been assigned to</p>
      
      <div className="search-section">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {assignments.length > 0 ? (
        <div className="schools-grid">
          {assignments.map(school => (
            <div key={school.schoolId} className="school-card">
              <div className="school-icon">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <h3>{school.schoolName}</h3>
              <p>{school.schoolLocation || 'Location not specified'}</p>
              <div className="school-stats">
                <span>{school.studentCount || 0} Students</span>
                <span className="status active">Active</span>
              </div>
              <Link 
                to={`/schools/${school.schoolId}/classes`}
                className="view-school-btn"
              >
                View Classes
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faExclamationCircle} />
          <p>No Schools found</p>
        </div>
      )}
    </div>
  );

  // ... [keep other render functions the same] ...

    const renderLessons = () => (
      <div className="lessons-management">
        <h1>Classes</h1>

        {assignmentsLoading && (
          <div className="empty-state"><p>Loading your classes...</p></div>
        )}
        {assignmentsError && (
          <div className="empty-state"><p>{assignmentsError}</p></div>
        )}

        {!assignmentsLoading && !assignmentsError && (
          assignments?.length > 0 ? (
            <div className="lessons-grid">
              {assignments.map(assign => (
                (assign.classes || []).filter(c => c.isActive).map(cls => (
                  <div key={`${assign.schoolId}-${cls.classId}`} className="lesson-card">
                    <div className="lesson-icon">
                      <FontAwesomeIcon icon={faBookOpen} />
                    </div>
                    <h3>{cls.className || 'Unnamed Class'}</h3>
                    <p>{assign.schoolName} ({assign.schoolCode})</p>
                    {recentCodes[cls.classId] ? (
                      <p>Current Code: <strong>{recentCodes[cls.classId].code}</strong></p>
                    ) : null}
                    <button className="view-school-btn" onClick={() => handleGenerateClassCode(assign.schoolId, cls.classId)}>
                      Generate Class Code
                    </button>
                  </div>
                ))
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <p>No classes found for your assignments</p>
            </div>
          )
        )}
      </div>
    );

  const renderFormLinks = () => (
    <div className="form-links-management">
      <h1>Form Links</h1>
      <div className="empty-state">
        <FontAwesomeIcon icon={faExclamationCircle} />
        <p>No form links available</p>
      </div>
    </div>
  );



  return (
  <div className="tutor-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">C</div>
            <div className="logo-text">
              <h2>Cobot KIDS kENYA</h2>
              <p>CODING FOR KIDS</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <FontAwesomeIcon icon={faBookOpen} />
            <span>Lessons</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'formLinks' ? 'active' : ''}`}
            onClick={() => setActiveTab('formLinks')}
          >
            <FontAwesomeIcon icon={faLink} />
            <span>Form Links</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'schools' ? 'active' : ''}`}
            onClick={() => setActiveTab('schools')}
          >
            <FontAwesomeIcon icon={faBuilding} />
            <span>Schools</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span>Students</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUserGraduate} />
            </div>
            <div className="user-info">
              <h4>{tutorDetails ? `${tutorDetails.fname} ${tutorDetails.lname}` : 'Loading...'}</h4>
              <p>{tutorDetails?.username || 'Loading...'}</p>
            </div>
            <button className="profile-dropdown">
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'students' && 
            
            (
              <div>
                <h2>My Studentd</h2>
                  <ComingSoon />
              </div>
            )}
            {activeTab === 'schools' && renderSchools()}
            {activeTab === 'lessons' && renderLessons()}
            {activeTab === 'formLinks' && renderFormLinks()}
          </>
        )}
      </main>
    </div>
  );
}

export default TutorDashboard;