import React, { useState } from 'react';
import '../stylesFolder/About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { value: '10,000+', label: 'Students' },
    { value: '50+', label: 'Courses' },
    { value: '100+', label: 'Countries' },
    { value: '24/7', label: 'Support' }
  ];

  const teamMembers = [
    { name: 'Alex Chen', role: 'Founder & CEO', emoji: '👨‍💻' },
    { name: 'Samira Khan', role: 'Lead Educator', emoji: '👩‍🏫' },
    { name: 'Jamie Smith', role: 'Game Developer', emoji: '🎮' },
    { name: 'Taylor Wong', role: 'Security Expert', emoji: '🔒' }
  ];

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="section-title">
          <span className="title-icon">✨</span> About CodeForKids
        </h2>
        
        {/* Tab Navigation */}
        <div className="about-tabs">
          <button 
            className={`tab-button ${activeTab === 'mission' ? 'active' : ''}`}
            onClick={() => setActiveTab('mission')}
          >
            Our Mission
          </button>
          <button 
            className={`tab-button ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            Our Story
          </button>
          <button 
            className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Our Team
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'mission' && (
            <div className="mission-content">
              <div className="mission-text">
                <h3>Making coding fun and accessible for everyone</h3>
                <p>
                  At CodeForKids, we believe that learning to code should be as exciting as playing a game. 
                  Our interactive platform turns complex programming concepts into engaging challenges that 
                  kids love to solve.
                </p>
                <p>
                  We're on a mission to prepare the next generation for the digital future by developing 
                  critical thinking, creativity, and problem-solving skills through code.
                </p>
              </div>
              <div className="mission-image">
                <div className="floating-code">print("Hello World!")</div>
                <div className="floating-code">function learn() {"{}"}</div>
                <div className="mission-illustration">👩‍💻🚀🎯</div>
              </div>
            </div>
          )}
          
          {activeTab === 'story' && (
            <div className="story-content">
              <div className="story-timeline">
                <div className="timeline-item">
                  <div className="timeline-year">2018</div>
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <h4>Founded in a dorm room</h4>
                    <p>Started as a small project to teach coding to neighborhood kids</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2020</div>
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <h4>First 1,000 students</h4>
                    <p>Launched our web platform during the pandemic to help kids learn remotely</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2023</div>
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <h4>Global community</h4>
                    <p>Expanded to over 100 countries with courses in 5 languages</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'team' && (
            <div className="team-content">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-emoji">{member.emoji}</div>
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Stats Section */}
        <div className="stats-section">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;