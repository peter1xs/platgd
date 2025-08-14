import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
  const [selectedSchool, setSelectedSchool] = useState('Bright gift School');
  const [selectedClass, setSelectedClass] = useState('Grade 7 wisdom');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState('');
  const [recentCodes, setRecentCodes] = useState({}); // key: classId -> { code, validUntil }
  const [tutorDetails, setTutorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tutor details
  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const profileRaw = localStorage.getItem('tutor_profile');
        if (!profileRaw) throw new Error('No tutor profile found');
        
        const profile = JSON.parse(profileRaw);
        const tutorId = profile?.id;
        if (!tutorId) throw new Error('No tutor ID found');

        // Fetch tutor details
        const tutorResponse = await fetch(`https://platform-zl0a.onrender.com/cobotKidsKenya/tutors/${tutorId}`);
        if (!tutorResponse.ok) {
          throw new Error(`HTTP error! status: ${tutorResponse.status}`);
        }
        
        const tutorResult = await tutorResponse.json();
        setTutorDetails(tutorResult.data || null);

        // Fetch assignments
        setAssignmentsLoading(true);
        setAssignmentsError('');
        const assignmentsResponse = await fetch(`https://platform-zl0a.onrender.com/cobotKidsKenya/tutors/${tutorId}/assignments`);
        const assignmentsData = await assignmentsResponse.json();
        
        if (!assignmentsData.success) {
          throw new Error(assignmentsData.error || 'Failed to load assignments');
        }
        
        setAssignments(Array.isArray(assignmentsData.data) ? assignmentsData.data : []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch tutor data:", err);
      } finally {
        setLoading(false);
        setAssignmentsLoading(false);
      }
    };

    fetchTutorDetails();
  }, []);

  // Sample data - will be replaced with actual data from API
  const dashboardStats = {
    students: 0,
    schools: assignments.length || 0,
    classes: assignments.reduce((sum, a) => sum + (a.classes?.length || 0), 0) || 0,
    rating: 0
  };

  const students = [
    {
      id: 1,
      name: 'Sabra Odongo',
      gender: 'female',
      username: 'mrm-sabraodongo',
      school: 'Bright gift School',
      class: 'Grade 7 wisdom',
      performance: 'Exceeds Expectation',
      lastLogin: '18-07-2025 11:31 AM'
    },
    {
      id: 2,
      name: 'Cassie Kariuki',
      gender: 'female',
      username: 'mrm-cassiekariuki',
      school: 'Bright gift School',
      class: 'Grade 7 wisdom',
      performance: 'Exceeds Expectation',
      lastLogin: '25-07-2025 11:42 AM'
    },
    {
      id: 3,
      name: 'Cyrill Anyanga',
      gender: 'male',
      username: 'mrm-cyrillanyanga',
      school: 'Bright gift School',
      class: 'Grade 7 wisdom',
      performance: 'Exceeds Expectation',
      lastLogin: '20-07-2025 09:15 AM'
    }
  ];

  const schools = [
    { id: 1, name: 'Bright gift School', location: 'Nairobi', students: 150, status: 'Active' },
    { id: 2, name: 'GraceLand School', location: 'Mombasa', students: 200, status: 'Active' }
  ];

  const lessons = [
    { id: 1, title: 'Introduction to Python', date: '2025-08-05', time: '09:00 AM', status: 'Scheduled' },
    { id: 2, title: 'Web Development Basics', date: '2025-08-06', time: '10:00 AM', status: 'Scheduled' }
  ];

  const generateSelfRegistrationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setShowSelfRegistration(true);
    // In a real app, this would be sent to the backend
    alert(`Generated Code: ${code}`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSchool('Bright gift School');
    setSelectedClass('Grade 7 wisdom');
    setPerformanceFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const handleGenerateClassCode = async (schoolId, classId) => {
    try {
      const res = await axios.post(`https://platform-zl0a.onrender.com/cobotKidsKenya/schools/${schoolId}/classes/${classId}/generateCode`, {});
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

  // ... [rest of the render functions remain exactly the same] ...

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
            {activeTab === 'students' && renderStudents()}
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