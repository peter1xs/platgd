import React, { useState, useEffect } from 'react';
import './ExamsManagement.css';

const ExamsManagement = ({ tutorId }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    startDate: '',
    endDate: '',
    duration: '',
    totalPoints: '',
    instructions: '',
    status: 'draft',
    questions: []
  });

  useEffect(() => {
    fetchExams();
  }, [tutorId]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutor-dashboard/exams/${tutorId}`);
      const data = await response.json();
      
      if (data.success) {
        setExams(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingExam 
        ? `/api/tutor-dashboard/exams/${editingExam._id}`
        : '/api/tutor-dashboard/exams';
      
      const method = editingExam ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tutor: tutorId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowForm(false);
        setEditingExam(null);
        resetForm();
        fetchExams();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to save exam');
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description,
      subject: exam.subject,
      class: exam.class._id,
      startDate: exam.startDate.split('T')[0],
      endDate: exam.endDate.split('T')[0],
      duration: exam.duration,
      totalPoints: exam.totalPoints,
      instructions: exam.instructions,
      status: exam.status,
      questions: exam.questions || []
    });
    setShowForm(true);
  };

  const handleDelete = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        const response = await fetch(`/api/tutor-dashboard/exams/${examId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (data.success) {
          fetchExams();
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to delete exam');
      }
    }
  };

  const handleGradeSubmission = async (examId, studentId, answers, totalScore, percentage) => {
    try {
      const response = await fetch(`/api/tutor-dashboard/exams/${examId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          answers,
          totalScore,
          percentage,
          tutorId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowGradingModal(false);
        setSelectedExam(null);
        fetchExams();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to grade submission');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      class: '',
      startDate: '',
      endDate: '',
      duration: '',
      totalPoints: '',
      instructions: '',
      status: 'draft',
      questions: []
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

  const isActive = (startDate, endDate) => {
    const now = new Date();
    return now >= new Date(startDate) && now <= new Date(endDate);
  };

  if (loading) {
    return (
      <div className="exams-loading">
        <div className="loading-spinner"></div>
        <p>Loading exams...</p>
      </div>
    );
  }

  return (
    <div className="exams-management">
      <div className="exams-header">
        <h2>Exams Management</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingExam(null);
            resetForm();
          }}
        >
          + New Exam
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Exam Form */}
      {showForm && (
        <div className="exam-form-overlay">
          <div className="exam-form">
            <div className="form-header">
              <h3>{editingExam ? 'Edit Exam' : 'Create New Exam'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingExam(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Class *</label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Points *</label>
                  <input
                    type="number"
                    value={formData.totalPoints}
                    onChange={(e) => setFormData({...formData, totalPoints: e.target.value})}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingExam(null);
                  resetForm();
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingExam ? 'Update Exam' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedExam && (
        <div className="grading-modal-overlay">
          <div className="grading-modal">
            <div className="modal-header">
              <h3>Grade Submissions - {selectedExam.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowGradingModal(false);
                  setSelectedExam(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="submissions-list">
              {selectedExam.submissions?.length > 0 ? (
                selectedExam.submissions.map((submission) => (
                  <div key={submission.student._id} className="submission-item">
                    <div className="submission-header">
                      <h4>{submission.student.fname} {submission.student.lname}</h4>
                      <span className={`status-badge ${submission.status}`}>
                        {submission.status}
                      </span>
                    </div>
                    
                    <div className="submission-content">
                      <p><strong>Started:</strong> {formatDate(submission.startedAt)}</p>
                      {submission.submittedAt && (
                        <p><strong>Submitted:</strong> {formatDate(submission.submittedAt)}</p>
                      )}
                      <p><strong>Time Spent:</strong> {submission.timeSpent || 0} minutes</p>
                      
                      {submission.grade ? (
                        <div className="graded-info">
                          <p><strong>Score:</strong> {submission.totalScore}/{selectedExam.totalPoints}</p>
                          <p><strong>Percentage:</strong> {submission.percentage}%</p>
                          <p><strong>Grade:</strong> {submission.grade}</p>
                        </div>
                      ) : (
                        <div className="grading-form">
                          <input
                            type="number"
                            placeholder="Total Score"
                            min="0"
                            max={selectedExam.totalPoints}
                            onChange={(e) => {
                              submission.tempScore = e.target.value;
                            }}
                          />
                          <button 
                            className="btn-primary"
                            onClick={() => handleGradeSubmission(
                              selectedExam._id,
                              submission.student._id,
                              submission.answers || [],
                              submission.tempScore,
                              (submission.tempScore / selectedExam.totalPoints) * 100
                            )}
                          >
                            Grade
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No submissions yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exams List */}
      <div className="exams-list">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div key={exam._id} className="exam-card">
              <div className="exam-header">
                <h3>{exam.title}</h3>
                <div className="exam-actions">
                  <button 
                    className="btn-grade"
                    onClick={() => {
                      setSelectedExam(exam);
                      setShowGradingModal(true);
                    }}
                  >
                    Grade
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(exam)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(exam._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="exam-details">
                <p className="exam-description">{exam.description}</p>
                <div className="exam-meta">
                  <span className="meta-item">
                    <strong>Subject:</strong> {exam.subject}
                  </span>
                  <span className="meta-item">
                    <strong>Class:</strong> {exam.class?.name}
                  </span>
                  <span className="meta-item">
                    <strong>Start Date:</strong> {formatDate(exam.startDate)}
                  </span>
                  <span className="meta-item">
                    <strong>End Date:</strong> {formatDate(exam.endDate)}
                  </span>
                  <span className="meta-item">
                    <strong>Duration:</strong> {exam.duration} minutes
                  </span>
                  <span className="meta-item">
                    <strong>Points:</strong> {exam.totalPoints}
                  </span>
                  <span className="meta-item">
                    <strong>Submissions:</strong> {exam.submissions?.length || 0}
                  </span>
                </div>
                <div className="exam-status">
                  <span className={`status-badge ${exam.status}`}>
                    {exam.status}
                  </span>
                  {isActive(exam.startDate, exam.endDate) && (
                    <span className="active-badge">Active</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-exams">
            <p>No exams found. Create your first exam!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsManagement;

