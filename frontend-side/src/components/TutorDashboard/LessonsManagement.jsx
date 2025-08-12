import React, { useState, useEffect } from 'react';
import './LessonsManagement.css';

const LessonsManagement = ({ tutorId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    content: '',
    scheduledDate: '',
    duration: '',
    difficulty: 'Beginner',
    status: 'draft'
  });

  useEffect(() => {
    fetchLessons();
  }, [tutorId]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutor-dashboard/lessons/${tutorId}`);
      const data = await response.json();
      
      if (data.success) {
        setLessons(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingLesson 
        ? `/api/tutor-dashboard/lessons/${editingLesson._id}`
        : '/api/tutor-dashboard/lessons';
      
      const method = editingLesson ? 'PUT' : 'POST';
      
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
        setEditingLesson(null);
        resetForm();
        fetchLessons();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to save lesson');
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      subject: lesson.subject,
      class: lesson.class._id,
      content: lesson.content,
      scheduledDate: lesson.scheduledDate.split('T')[0],
      duration: lesson.duration,
      difficulty: lesson.difficulty,
      status: lesson.status
    });
    setShowForm(true);
  };

  const handleDelete = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        const response = await fetch(`/api/tutor-dashboard/lessons/${lessonId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (data.success) {
          fetchLessons();
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to delete lesson');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      class: '',
      content: '',
      scheduledDate: '',
      duration: '',
      difficulty: 'Beginner',
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

  if (loading) {
    return (
      <div className="lessons-loading">
        <div className="loading-spinner"></div>
        <p>Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="lessons-management">
      <div className="lessons-header">
        <h2>Lessons Management</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingLesson(null);
            resetForm();
          }}
        >
          + New Lesson
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Lesson Form */}
      {showForm && (
        <div className="lesson-form-overlay">
          <div className="lesson-form">
            <div className="form-header">
              <h3>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingLesson(null);
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
                  <label>Scheduled Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    required
                  />
                </div>

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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
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
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="6"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingLesson(null);
                  resetForm();
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lessons List */}
      <div className="lessons-list">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson._id} className="lesson-card">
              <div className="lesson-header">
                <h3>{lesson.title}</h3>
                <div className="lesson-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(lesson)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(lesson._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="lesson-details">
                <p className="lesson-description">{lesson.description}</p>
                <div className="lesson-meta">
                  <span className="meta-item">
                    <strong>Subject:</strong> {lesson.subject}
                  </span>
                  <span className="meta-item">
                    <strong>Class:</strong> {lesson.class?.name}
                  </span>
                  <span className="meta-item">
                    <strong>Date:</strong> {formatDate(lesson.scheduledDate)}
                  </span>
                  <span className="meta-item">
                    <strong>Duration:</strong> {lesson.duration} minutes
                  </span>
                </div>
                <div className="lesson-status">
                  <span className={`status-badge ${lesson.status}`}>
                    {lesson.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-lessons">
            <p>No lessons found. Create your first lesson!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsManagement;

