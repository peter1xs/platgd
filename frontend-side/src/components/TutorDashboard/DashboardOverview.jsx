import React, { useState, useEffect } from 'react';
import './DashboardOverview.css';

const DashboardOverview = ({ tutorId }) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [tutorId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutor-dashboard/dashboard/${tutorId}`);
      const data = await response.json();
      
      if (data.success) {
        setOverview(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-overview-loading">
        <div className="loading-spinner"></div>
        <p>Loading overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-overview-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  if (!overview) {
    return <div>No data available</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-overview">
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{overview.overview?.studentCount || 0}</h3>
            <p>Total Students</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{overview.overview?.totalLessons || 0}</h3>
            <p>Total Lessons</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{overview.overview?.totalAssignments || 0}</h3>
            <p>Total Assignments</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{overview.overview?.totalExams || 0}</h3>
            <p>Total Exams</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-grid">
        {/* Recent Lessons */}
        <div className="activity-section">
          <h3>Recent Lessons</h3>
          <div className="activity-list">
            {overview.recentLessons?.length > 0 ? (
              overview.recentLessons.map((lesson) => (
                <div key={lesson._id} className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <h4>{lesson.title}</h4>
                    <p>{lesson.class?.name} • {lesson.school?.name}</p>
                    <span className="activity-date">
                      {formatDate(lesson.scheduledDate)} at {formatTime(lesson.scheduledDate)}
                    </span>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${lesson.status}`}>
                      {lesson.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent lessons</p>
            )}
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="activity-section">
          <h3>Upcoming Lessons</h3>
          <div className="activity-list">
            {overview.upcomingLessons?.length > 0 ? (
              overview.upcomingLessons.map((lesson) => (
                <div key={lesson._id} className="activity-item">
                  <div className="activity-icon">📅</div>
                  <div className="activity-content">
                    <h4>{lesson.title}</h4>
                    <p>{lesson.class?.name} • {lesson.school?.name}</p>
                    <span className="activity-date">
                      {formatDate(lesson.scheduledDate)} at {formatTime(lesson.scheduledDate)}
                    </span>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${lesson.status}`}>
                      {lesson.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No upcoming lessons</p>
            )}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="activity-section">
          <h3>Pending Assignments</h3>
          <div className="activity-list">
            {overview.pendingAssignments?.length > 0 ? (
              overview.pendingAssignments.map((assignment) => (
                <div key={assignment._id} className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <h4>{assignment.title}</h4>
                    <p>{assignment.class?.name} • {assignment.school?.name}</p>
                    <span className="activity-date">
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${assignment.status}`}>
                      {assignment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No pending assignments</p>
            )}
          </div>
        </div>

        {/* Recent Exams */}
        <div className="activity-section">
          <h3>Recent Exams</h3>
          <div className="activity-list">
            {overview.recentExams?.length > 0 ? (
              overview.recentExams.map((exam) => (
                <div key={exam._id} className="activity-item">
                  <div className="activity-icon">📋</div>
                  <div className="activity-content">
                    <h4>{exam.title}</h4>
                    <p>{exam.class?.name} • {exam.school?.name}</p>
                    <span className="activity-date">
                      {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                    </span>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${exam.status}`}>
                      {exam.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent exams</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

