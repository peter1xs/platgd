import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import LessonsManagement from './LessonsManagement';
import StudentsManagement from './StudentsManagement';
import AssignmentsManagement from './AssignmentsManagement';
import ExamsManagement from './ExamsManagement';
import SchoolsManagement from './SchoolsManagement';
import './TutorDashboard.css';

const TutorDashboard = () => {
  const { tutorId } = useParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTutorData();
  }, [tutorId]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutor-dashboard/dashboard/${tutorId}`);
      const data = await response.json();
      
      if (data.success) {
        setTutor(data.data.tutor);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch tutor data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'lessons', label: 'Lessons', icon: '📚' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'exams', label: 'Exams', icon: '📋' },
    { id: 'schools', label: 'Schools', icon: '🏫' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview tutorId={tutorId} />;
      case 'lessons':
        return <LessonsManagement tutorId={tutorId} />;
      case 'students':
        return <StudentsManagement tutorId={tutorId} />;
      case 'assignments':
        return <AssignmentsManagement tutorId={tutorId} />;
      case 'exams':
        return <ExamsManagement tutorId={tutorId} />;
      case 'schools':
        return <SchoolsManagement tutorId={tutorId} />;
      default:
        return <DashboardOverview tutorId={tutorId} />;
    }
  };

  if (loading) {
    return (
      <div className="tutor-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tutor-dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchTutorData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="tutor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Tutor Dashboard</h1>
          {tutor && (
            <div className="tutor-info">
              <div className="tutor-avatar">
                {tutor.profileImage ? (
                  <img src={tutor.profileImage} alt={tutor.fullName} />
                ) : (
                  <div className="avatar-placeholder">
                    {tutor.fname?.charAt(0)}{tutor.lname?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="tutor-details">
                <h3>{tutor.fname} {tutor.lname}</h3>
                <p>{tutor.email}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default TutorDashboard;

