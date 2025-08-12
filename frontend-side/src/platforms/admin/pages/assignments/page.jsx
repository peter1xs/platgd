import React, { useState, useEffect } from 'react';
import './Assignments.css';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    topic: '',
    subject: '',
    class: '',
    dueDate: '',
    totalPoints: '',
    instructions: '',
    duration: 60,
    allowLateSubmission: false,
    maxAttempts: 1,
    autoGrade: false,
    showResults: true,
    status: 'draft'
  });

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/cobotKidsKenya/assignments');
      const data = await response.json();
      
      if (data.success) {
        setAssignments(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/cobotKidsKenya/courses');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const fetchTopics = async (courseId) => {
    if (!courseId) return;
    
    try {
      const response = await fetch(`/cobotKidsKenya/courses/${courseId}`);
      const data = await response.json();
      
      if (data.success) {
        setTopics(data.data.topics || []);
      }
    } catch (err) {
      console.error('Failed to fetch topics:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAssignment 
        ? `/cobotKidsKenya/assignments/${editingAssignment._id}`
        : '/cobotKidsKenya/assignments';
      
      const method = editingAssignment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowForm(false);
        setEditingAssignment(null);
        resetForm();
        fetchAssignments();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to save assignment');
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course,
      topic: assignment.topic,
      subject: assignment.subject,
      class: assignment.class,
      dueDate: assignment.dueDate.split('T')[0],
      totalPoints: assignment.totalPoints,
      instructions: assignment.instructions,
      duration: assignment.duration || 60,
      allowLateSubmission: assignment.allowLateSubmission || false,
      maxAttempts: assignment.maxAttempts || 1,
      autoGrade: assignment.autoGrade || false,
      showResults: assignment.showResults !== false,
      status: assignment.status
    });
    setShowForm(true);
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const response = await fetch(`/cobotKidsKenya/assignments/${assignmentId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (data.success) {
          fetchAssignments();
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to delete assignment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course: '',
      topic: '',
      subject: '',
      class: '',
      dueDate: '',
      totalPoints: '',
      instructions: '',
      duration: 60,
      allowLateSubmission: false,
      maxAttempts: 1,
      autoGrade: false,
      showResults: true,
      status: 'draft'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  if (loading) {
    return (
      <div className="assignments-loading">
        <div className="loading-spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="assignments-management">
      <div className="assignments-header">
        <h1>Assignment Management</h1>
        <p>Create and manage assignments for your courses and topics</p>
        <button 
          className="add-assignment-btn"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus"></i>
          Create New Assignment
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Assignment Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingAssignment(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            
            <form className="assignment-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Assignment Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="Enter assignment title"
                  />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    placeholder="e.g., Mathematics, Science"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Course *</label>
                  <select
                    className="form-input"
                    value={formData.course}
                    onChange={(e) => {
                      setFormData({...formData, course: e.target.value, topic: ''});
                      fetchTopics(e.target.value);
                    }}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Topic *</label>
                  <select
                    className="form-input"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    required
                    disabled={!formData.course}
                  >
                    <option value="">Select Topic</option>
                    {topics.map(topic => (
                      <option key={topic._id} value={topic._id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Describe the assignment requirements..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Points *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.totalPoints}
                    onChange={(e) => setFormData({...formData, totalPoints: e.target.value})}
                    required
                    min="1"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    min="15"
                    placeholder="60"
                  />
                </div>
                <div className="form-group">
                  <label>Max Attempts</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.maxAttempts}
                    onChange={(e) => setFormData({...formData, maxAttempts: e.target.value})}
                    min="1"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  className="form-textarea"
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  placeholder="Additional instructions for students..."
                  rows="3"
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.allowLateSubmission}
                    onChange={(e) => setFormData({...formData, allowLateSubmission: e.target.checked})}
                  />
                  Allow late submissions
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.autoGrade}
                    onChange={(e) => setFormData({...formData, autoGrade: e.target.checked})}
                  />
                  Auto-grade multiple choice questions
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.showResults}
                    onChange={(e) => setFormData({...formData, showResults: e.target.checked})}
                  />
                  Show results to students
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAssignment(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="assignments-section">
        <div className="section-header">
          <h2>All Assignments</h2>
          <div className="section-stats">
            <div className="stat-item">
              <span className="stat-number">{assignments.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {assignments.filter(a => a.status === 'published').length}
              </span>
              <span className="stat-label">Published</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {assignments.filter(a => a.status === 'active').length}
              </span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>

        {assignments.length > 0 ? (
          <div className="assignments-grid">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <div className="assignment-header">
                  <h3>{assignment.title}</h3>
                  <div className="assignment-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowQuestionsModal(true);
                      }}
                    >
                      <i className="fas fa-question-circle"></i>
                      Questions
                    </button>
                    <button 
                      className="action-btn primary"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowResultsModal(true);
                      }}
                    >
                      <i className="fas fa-chart-bar"></i>
                      Results
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEdit(assignment)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(assignment._id)}
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="assignment-content">
                  <p className="assignment-description">{assignment.description}</p>
                  
                  <div className="assignment-meta">
                    <div className="meta-row">
                      <span className="meta-item">
                        <i className="fas fa-book"></i>
                        <strong>Course:</strong> {assignment.course?.courseName || 'N/A'}
                      </span>
                      <span className="meta-item">
                        <i className="fas fa-tag"></i>
                        <strong>Topic:</strong> {assignment.topic?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-item">
                        <i className="fas fa-calendar"></i>
                        <strong>Due:</strong> {formatDate(assignment.dueDate)}
                        {isOverdue(assignment.dueDate) && (
                          <span className="overdue-badge">Overdue</span>
                        )}
                      </span>
                      <span className="meta-item">
                        <i className="fas fa-star"></i>
                        <strong>Points:</strong> {assignment.totalPoints}
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-item">
                        <i className="fas fa-users"></i>
                        <strong>Participants:</strong> {assignment.submissionCount || 0}
                      </span>
                      <span className="meta-item">
                        <i className="fas fa-chart-line"></i>
                        <strong>Avg Score:</strong> {assignment.averageGrade || 0}%
                      </span>
                    </div>
                  </div>

                  <div className="assignment-status">
                    <span className={`status-badge ${assignment.status}`}>
                      {assignment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-assignments">
            <div className="no-assignments-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <h3>No Assignments Yet</h3>
            <p>Create your first assignment to get started!</p>
            <button 
              className="add-first-assignment-btn"
              onClick={() => setShowForm(true)}
            >
              Create First Assignment
            </button>
          </div>
        )}
      </div>

      {/* Questions Modal */}
      {showQuestionsModal && selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Questions - {selectedAssignment.title}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowQuestionsModal(false);
                  setSelectedAssignment(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="questions-content">
              {selectedAssignment.questions && selectedAssignment.questions.length > 0 ? (
                <div className="questions-list">
                  {selectedAssignment.questions.map((question, index) => (
                    <div key={question._id} className="question-item">
                      <div className="question-header">
                        <span className="question-number">Q{index + 1}</span>
                        <span className="question-type">{question.questionType}</span>
                        <span className="question-points">{question.points} pts</span>
                      </div>
                      <div className="question-text">
                        {question.questionText}
                      </div>
                      {question.questionType === 'multiple_choice' && question.options && (
                        <div className="question-options">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className={`option ${option.isCorrect ? 'correct' : ''}`}>
                              <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                              <span className="option-text">{option.text}</span>
                              {option.isCorrect && <i className="fas fa-check correct-icon"></i>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-questions">
                  <p>No questions added to this assignment yet.</p>
                  <button className="add-questions-btn">
                    Add Questions
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResultsModal && selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Results - {selectedAssignment.title}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowResultsModal(false);
                  setSelectedAssignment(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="results-content">
              <div className="results-summary">
                <div className="summary-card">
                  <h3>Participation</h3>
                  <div className="summary-stat">
                    <span className="stat-number">{selectedAssignment.submissionCount || 0}</span>
                    <span className="stat-label">Total Submissions</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number">{selectedAssignment.completionRate || 0}%</span>
                    <span className="stat-label">Completion Rate</span>
                  </div>
                </div>
                
                <div className="summary-card">
                  <h3>Performance</h3>
                  <div className="summary-stat">
                    <span className="stat-number">{selectedAssignment.averageGrade || 0}%</span>
                    <span className="stat-label">Average Score</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number">
                      {selectedAssignment.submissions?.filter(s => s.percentage >= 80).length || 0}
                    </span>
                    <span className="stat-label">High Performers (80%+)</span>
                  </div>
                </div>
              </div>

              {selectedAssignment.submissions && selectedAssignment.submissions.length > 0 ? (
                <div className="submissions-list">
                  <h3>Student Submissions</h3>
                  <div className="submissions-table">
                    <div className="table-header">
                      <span>Student</span>
                      <span>Submitted</span>
                      <span>Score</span>
                      <span>Status</span>
                      <span>Actions</span>
                    </div>
                    {selectedAssignment.submissions.map((submission) => (
                      <div key={submission._id} className="table-row">
                        <span className="student-name">
                          {submission.student?.fname} {submission.student?.lname}
                        </span>
                        <span className="submission-date">
                          {formatDate(submission.submittedAt)}
                        </span>
                        <span className="submission-score">
                          {submission.percentage || 0}%
                        </span>
                        <span className={`submission-status ${submission.status}`}>
                          {submission.status}
                        </span>
                        <span className="submission-actions">
                          <button className="view-btn">View</button>
                          <button className="grade-btn">Grade</button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-submissions">
                  <p>No submissions yet for this assignment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
