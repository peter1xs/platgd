import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header/Header';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(topicId ? 'notes' : 'topics');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details with embedded topics
        const response = await axios.get(
          `http://localhost:3001/cobotKidsKenya/courses/${courseId}`
        );
        
        const courseData = response.data;
        setCourse(courseData);
        setTopics(courseData.topics || []);

        // If topicId is specified, find and select that topic
        if (topicId && courseData.topics) {
          const foundTopic = courseData.topics.find(topic => topic._id === topicId);
          if (foundTopic) {
            setSelectedTopic(foundTopic);
          } else {
            throw new Error('Requested topic not found in this course');
          }
        }

      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load course data');
        console.error('Error fetching course data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, topicId]);

  const handleTopicClick = (topic) => {
    navigate(`/course/${courseId}/topic/${topic._id}`);
    setSelectedTopic(topic);
    setSelectedNote(null);
    setActiveTab('notes');
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleStartPractice = () => {
    navigate(`/course/${courseId}/topic/${selectedTopic._id}/practice`, {
      state: { 
        course, 
        topic: selectedTopic
      }
    });
  };

  const handleAssignmentClick = () => {
    navigate(`/course/${courseId}/topic/${selectedTopic._id}/assignment`, {
      state: { 
        course, 
        topic: selectedTopic
      }
    });
  };

  const handleBackToTopics = () => {
    navigate(`/course/${courseId}`);
    setSelectedTopic(null);
    setActiveTab('topics');
  };

  if (loading) {
    return (
      <div className="course-detail-container">
        <Header />
        <div className="loading">Loading course data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-detail-container">
        <Header />
        <div className="error">{error}</div>
        <button 
          className="back-btn"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <Header />
        <div className="error">Course not found</div>
        <button 
          className="back-btn"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <Header />
      
      <div className="course-detail-content">
        {/* Course Header */}
        <div className="course-header">
          <div className="course-info">
            <img src={course.courseIcon} alt={course.courseName} className="course-icon" />
            <div className="course-details">
              <h1>{course.courseName}</h1>
              <p className="course-code">Code: {course.code}</p>
            </div>
          </div>
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="course-tabs">
          <button 
            className={`tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => {
              if (selectedTopic) handleBackToTopics();
              else setActiveTab('topics');
            }}
          >
            Topics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
            disabled={!selectedTopic}
          >
            Notes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
            disabled={!selectedTopic}
          >
            Assignments
          </button>
        </div>

        {/* Content Area */}
        <div className="course-content">
          {activeTab === 'topics' && (
            <div className="topics-section">
              <h2>Course Topics</h2>
              <div className="topics-grid">
                {topics.map((topic) => (
                  <div 
                    key={topic._id} 
                    className={`topic-card ${selectedTopic?._id === topic._id ? 'selected' : ''}`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    <div className="topic-icon">📚</div>
                    <h3>{topic.name}</h3>
                    <p>{topic.notes?.length || 0} notes available</p>
                    <div className="topic-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTopicClick(topic);
                        }}
                      >
                        View Notes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {topics.length === 0 && (
                <div className="no-topics">
                  <p>No topics available for this course yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && selectedTopic && (
            <div className="notes-section">
              <div className="notes-header">
                <h2>Notes for: {selectedTopic.name}</h2>
                <button 
                  className="btn btn-secondary"
                  onClick={handleBackToTopics}
                >
                  ← Back to Topics
                </button>
              </div>

              <div className="notes-grid">
                {selectedTopic.notes?.length > 0 ? (
                  selectedTopic.notes.map((note, index) => (
                    <div 
                      key={index} 
                      className={`note-card ${selectedNote === note ? 'selected' : ''}`}
                      onClick={() => handleNoteClick(note)}
                    >
                      <div className="note-content">
                        <h3>Note {index + 1}</h3>
                        <p>{note.description}</p>
                        {note.images?.length > 0 && (
                          <div className="note-images">
                            <p>📷 {note.images.length} image(s)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notes">
                    <p>No notes available for this topic yet.</p>
                  </div>
                )}
              </div>

              {selectedTopic && (
                <div className="topic-actions-panel">
                  <button 
                    className="btn btn-primary"
                    onClick={handleStartPractice}
                  >
                    Start Practicing
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleAssignmentClick}
                  >
                    View Assignment
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && selectedTopic && (
            <div className="assignments-section">
              <div className="assignments-header">
                <h2>Assignments for: {selectedTopic.name}</h2>
                <button 
                  className="btn btn-secondary"
                  onClick={handleBackToTopics}
                >
                  ← Back to Topics
                </button>
              </div>

              <div className="assignments-list">
                {selectedTopic.coursework?.length > 0 ? (
                  selectedTopic.coursework.map((assignment, index) => (
                    <div key={index} className="assignment-card">
                      <h3>Assignment {index + 1}</h3>
                      <p>{assignment.content}</p>
                      <div className="assignment-meta">
                        <span>Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-assignments">
                    <p>No assignments available for this topic yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;