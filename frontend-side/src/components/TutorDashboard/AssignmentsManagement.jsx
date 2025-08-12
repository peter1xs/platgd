import React, { useState, useEffect } from 'react';
import './AssignmentsManagement.css';

const AssignmentsManagement = ({ tutorId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    dueDate: '',
    totalPoints: '',
    instructions: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchAssignments();
  }, [tutorId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutor-dashboard/assignments/${tutorId}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAssignment 
        ? `/api/tutor-dashboard/assignments/${editingAssignment._id}`
        : '/api/tutor-dashboard/assignments';
      
      const method = editingAssignment ? 'PUT' : 'POST';
      
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
      subject: assignment.subject,
      class: assignment.class._id,
      dueDate: assignment.dueDate.split('T')[0],
      totalPoints: assignment.totalPoints,
      instructions: assignment.instructions,
      status: assignment.status
    });
    setShowForm(true);
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const response = await fetch(`/api/tutor-dashboard/assignments/${assignmentId}`, {
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

  const handleGradeSubmission = async (assignmentId, studentId, grade, feedback) => {
    try {
      const response = await fetch(`/api/tutor-dashboard/assignments/${assignmentId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          grade,
          feedback,
          tutorId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowGradingModal(false);
        setSelectedAssignment(null);
        fetchAssignments();
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
      dueDate: '',
      totalPoints: '',
      instructions: '',
      status: 'draft'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
        <h2>Assignments Management</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingAssignment(null);
            resetForm();
          }}
        >
          + New Assignment
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Assignment Form */}
      {showForm && (
        <div className="assignment-form-overlay">
          <div className="assignment-form">
            <div className="form-header">
              <h3>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h3>
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
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
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
                  <label>Due Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
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
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingAssignment(null);
                  resetForm();
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedAssignment && (
        <div className="grading-modal-overlay">
          <div className="grading-modal">
            <div className="modal-header">
              <h3>Grade Submissions - {selectedAssignment.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowGradingModal(false);
                  setSelectedAssignment(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="submissions-list">
              {selectedAssignment.submissions?.length > 0 ? (
                selectedAssignment.submissions.map((submission) => (
                  <div key={submission.student._id} className="submission-item">
                    <div className="submission-header">
                      <h4>{submission.student.fname} {submission.student.lname}</h4>
                      <span className={`status-badge ${submission.status}`}>
                        {submission.status}
                      </span>
                    </div>
                    
                    <div className="submission-content">
                      <p><strong>Submitted:</strong> {formatDate(submission.submittedAt)}</p>
                      <p><strong>Content:</strong> {submission.content}</p>
                      
                      {submission.grade !== undefined ? (
                        <div className="graded-info">
                          <p><strong>Grade:</strong> {submission.grade}/{selectedAssignment.totalPoints}</p>
                          <p><strong>Feedback:</strong> {submission.feedback}</p>
                        </div>
                      ) : (
                        <div className="grading-form">
                          <input
                            type="number"
                            placeholder="Grade"
                            min="0"
                            max={selectedAssignment.totalPoints}
                            onChange={(e) => {
                              submission.tempGrade = e.target.value;
                            }}
                          />
                          <textarea
                            placeholder="Feedback"
                            onChange={(e) => {
                              submission.tempFeedback = e.target.value;
                            }}
                          />
                          <button 
                            className="btn-primary"
                            onClick={() => handleGradeSubmission(
                              selectedAssignment._id,
                              submission.student._id,
                              submission.tempGrade,
                              submission.tempFeedback
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

      {/* Assignments List */}
      <div className="assignments-list">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment._id} className="assignment-card">
              <div className="assignment-header">
                <h3>{assignment.title}</h3>
                <div className="assignment-actions">
                  <button 
                    className="btn-grade"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowGradingModal(true);
                    }}
                  >
                    Grade
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(assignment)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(assignment._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="assignment-details">
                <p className="assignment-description">{assignment.description}</p>
                <div className="assignment-meta">
                  <span className="meta-item">
                    <strong>Subject:</strong> {assignment.subject}
                  </span>
                  <span className="meta-item">
                    <strong>Class:</strong> {assignment.class?.name}
                  </span>
                  <span className="meta-item">
                    <strong>Due Date:</strong> {formatDate(assignment.dueDate)}
                    {isOverdue(assignment.dueDate) && (
                      <span className="overdue-badge">Overdue</span>
                    )}
                  </span>
                  <span className="meta-item">
                    <strong>Points:</strong> {assignment.totalPoints}
                  </span>
                  <span className="meta-item">
                    <strong>Submissions:</strong> {assignment.submissions?.length || 0}
                  </span>
                </div>
                <div className="assignment-status">
                  <span className={`status-badge ${assignment.status}`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-assignments">
            <p>No assignments found. Create your first assignment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsManagement;

