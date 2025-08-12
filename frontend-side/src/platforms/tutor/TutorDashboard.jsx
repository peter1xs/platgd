import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import SideBar from '../../components/SideBar'
import AddStudent from './AddStudent';
import ClassCodeGenarator from './ClassCodeGenarator';
import TutorProfile from './components/profile/TutorProfile'
import TutorDashboardMainArea from './TutorDashboardMainArea'
import './styles/TutorDashboardMainArea.css'
import Header from './components/header/Header';
function TutorDashboard() {

  const [activeTab, setActiveTab] = useState('courses');
  const [showExamModal, setShowExamModal] = useState(false);
  const [showClassCodeGenarator, setShowClassCodeGenarator] = useState(false);
  const [examCode, setExamCode] = useState('');

  // Sample data
  const schools = [
    { id: 1, title: 'GraceLand School', courseStatus: 'Enrolled', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk3pe7Z9yDNERjhspfG8uV6YogvXSPI7aypQ&s' },
    { id: 1, title: 'GraceLand School', courseStatus: 'Enrolled', icon: '' },
    { id: 1, title: 'GraceLand School', courseStatus: 'Enrolled', icon: '' },
    { id: 1, title: 'GraceLand School', courseStatus: 'Enrolled', icon: '' },

  ];

  const challenges = [
    { id: 1, title: 'Build a Calculator', deadline: '2023-12-15', icon: '🧮' },
    { id: 2, title: 'Create a Portfolio', deadline: '2023-12-20', icon: '💼' }
  ];

  const performanceData = {
    completed: 12,
    inProgress: 5,
    averageScore: 84
  };

  const followers = [
    { id: 1, name: 'Alex Johnson', avatar: '👨‍💻' },
    { id: 2, name: 'Samira Khan', avatar: '👩‍🎓' },
    { id: 3, name: 'Taylor Wong', avatar: '👨‍🔬' }
  ];

  const handleExamSubmit = (e) => {
    e.preventDefault();
    // Validate and process exam code
    alert(`Entering exam room with code: ${examCode}`);
    setShowExamModal(false);
    setExamCode('');
  };

  return (

    <div className="">
       <Header/>
      <TutorProfile />
      {/* Main Content */}
      <div className="student-dashboard-content">
        {/* Sidebar */}
        <aside className="student-sidebar">
          <nav>
            <button
              className={`student-sidebar-btn ${activeTab === 'schools' ? 'active' : ''}`}
              onClick={() => setActiveTab('schools')}
            >
              <span className="icon">📚</span>
              <span>My Schools</span>
            </button>

            <button
              className={`student-sidebar-btn ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              <span className="icon">🏆</span>
              <span>Students</span>
            </button>

            <button
              className={`student-sidebar-btn ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              <span className="icon">📈</span>
              <span>My Performance</span>
            </button>

            <button
              className={`student-sidebar-btn ${activeTab === 'followers' ? 'active' : ''}`}
              onClick={() => setActiveTab('followers')}
            >
              <span className="icon">👥</span>
              <span>Reasources</span>
            </button>

            <button
              className="exam-room-btn"
              onClick={() => setShowExamModal(true)}
            >
              <span className="icon">🚪</span>
              <span>Register A New Student</span>
            </button>

            <button
              className="exam-room-btn"
              onClick={() => setShowClassCodeGenarator(true)}
            >
              <span className="icon">Class Code</span>
              <span></span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="courses-grid">
              <h2 class="typing-effect">My Schools</h2>
              <div className="courses-list">
                {schools.map(schools => (
                  <div key={schools.id} className="course-card">
                    <div className="course-icon">
                      <img src={schools.icon} alt={schools.title} style={{ width: '240px', height: '240px', borderRadius: '10px' }} />
                    </div>
                    <h2>{schools.title}</h2>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${schools.courseStatus}` }}
                      ></div>
                      <span style={{ color: "white", background: 'green', padding: '0.4rem', borderRadius: '5px' }}>
                        {schools.courseStatus}
                      </span>
                    </div>
                    <Link to="" className="continue-btn">Enter School</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="challenges-section">
              <h2>Current Challenges</h2>
              <div className="challenges-list">
                {challenges.map(challenge => (
                  <div key={challenge.id} className="challenge-card">
                    <div className="challenge-icon">{challenge.icon}</div>
                    <div className="challenge-details">
                      <h3>{challenge.title}</h3>
                      <p>Deadline: {challenge.deadline}</p>
                    </div>
                    <button className="submit-btn">Submit Work</button>
                  </div>
                ))}
              </div>

              <div className="post-challenge">
                <h3>Post a New Challenge</h3>
                <textarea placeholder="Describe your challenge..."></textarea>
                <button className="post-btn">Post Challenge</button>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="performance-section">
              <h2>My Performance</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{performanceData.completed}</div>
                  <div className="stat-label">Courses Completed</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⌛</div>
                  <div className="stat-value">{performanceData.inProgress}</div>
                  <div className="stat-label">Courses in Progress</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-value">{performanceData.averageScore}%</div>
                  <div className="stat-label">Average Score</div>
                </div>
              </div>

              <div className="performance-graph">
                <h3>Progress Over Time</h3>
                <div className="graph-placeholder">
                  {/* This would be replaced with an actual chart component */}
                  <p>📈 Performance graph visualization would appear here</p>
                </div>
              </div>
            </div>
          )}

          {/* Followers Tab */}
          {activeTab === 'followers' && (
            <div className="followers-section">
              <h2>My Followers</h2>
              <div className="followers-list">
                {followers.map(follower => (
                  <div key={follower.id} className="follower-card">
                    <div className="follower-avatar">{follower.avatar}</div>
                    <div className="follower-name">{follower.name}</div>
                    <button className="message-btn">Message</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Exam Room Modal */}
      {showExamModal && (
        <AddStudent />
      )}


      {/* Exam Room Modal */}
      {showClassCodeGenarator && (
        <ClassCodeGenarator/> 
      )}
    </div>

  )
}

export default TutorDashboard