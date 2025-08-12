import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../stylesFolder/ExamRoom.css';

const ExamRoom = () => {
  const { examId: routeExamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [examDetails, setExamDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Helper to read examId from search (?examId=...)
  const getExamId = () => {
    const params = new URLSearchParams(location.search);
    return routeExamId || params.get('examId');
  };

  // Load exam data when component mounts
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setIsLoading(true);
        const examId = getExamId();
        if (!examId) {
          setError('Missing exam id');
          setIsLoading(false);
          return;
        }
        const response = await fetch(`http://localhost:3001/cobotKidsKenya/exams/${examId}`);
        const data = await response.json();

        if (data.success) {
          const exam = data.data;
          
          // Check if exam is active
          const now = new Date();
          if (exam.scheduledAt && now < new Date(exam.scheduledAt)) {
            setError("This exam has not started yet");
            return;
          }

          setExamDetails(exam);
          setTimeLeft(exam.duration * 60); // Convert to seconds
        } else {
          setError(data.error || "Failed to load exam");
        }
      } catch (err) {
        setError("Failed to load exam details");
        console.error("Error fetching exam:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamDetails();
  }, [routeExamId, location.search]);

  // Timer effect
  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [isStarted, timeLeft]);

  const handleStartExam = async () => {
    try {
      // Register exam start
      const examId = getExamId();
      const response = await fetch(`http://localhost:3001/cobotKidsKenya/exams/${examId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: localStorage.getItem("studentId"),
          startTime: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsStarted(true);
        startTimeRef.current = new Date();
      } else {
        setError(data.error || "Failed to start exam");
      }
    } catch (err) {
      setError("Failed to start exam");
      console.error("Error starting exam:", err);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examDetails.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      clearInterval(timerRef.current);
      
      const endTime = new Date();
      const timeSpent = startTimeRef.current 
        ? Math.round((endTime - startTimeRef.current) / 1000 / 60) // Convert to minutes
        : 0;

      // Submit exam answers
      const examId = getExamId();
      const response = await fetch(`http://localhost:3001/cobotKidsKenya/exams/${examId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: localStorage.getItem("studentId"),
          answers: answers,
          timeSpent: timeSpent,
          submittedAt: endTime.toISOString()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmissionResult(data.data);
        setIsSubmitted(true);
      } else {
        setError(data.error || "Failed to submit exam");
      }
    } catch (err) {
      setError("Failed to submit exam");
      console.error("Error submitting exam:", err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="exam-loading">
        <div className="loading-spinner"></div>
        <p>Loading exam...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/studentDashBoard')}>Return to Dashboard</button>
      </div>
    );
  }

  if (!examDetails) {
    return (
      <div className="exam-error">
        <h2>Exam Not Found</h2>
        <p>The exam you're looking for doesn't exist or you don't have access to it.</p>
        <button onClick={() => navigate('/studentDashBoard')}>Return to Dashboard</button>
      </div>
    );
  }

  if (isSubmitted && submissionResult) {
    return (
      <div className="exam-submitted">
        <div className="submission-result">
          <h2>Exam Completed!</h2>
          <div className="result-stats">
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">{submissionResult.totalScore}/{submissionResult.totalPoints}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Percentage</span>
              <span className="stat-value">{submissionResult.percentage}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Grade</span>
              <span className="stat-value">{submissionResult.grade}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time Spent</span>
              <span className="stat-value">{submissionResult.timeSpent} minutes</span>
            </div>
          </div>
          <div className="result-message">
            <p>Thank you for completing the {examDetails.title}.</p>
            <p>Your results have been recorded and will be available to your instructor.</p>
          </div>
          <button 
            className="return-btn"
            onClick={() => navigate('/studentDashBoard')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="exam-start">
        <div className="exam-info">
          <h2>{examDetails.title}</h2>
          <div className="exam-details">
            <p><strong>Duration:</strong> {examDetails.duration} minutes</p>
            <p><strong>Total Questions:</strong> {examDetails.questions.length}</p>
            <p><strong>Total Points:</strong> {examDetails.totalPoints}</p>
            <p><strong>Participants:</strong> {Array.isArray(examDetails.attempts) ? examDetails.attempts.length : 0}</p>
            {Array.isArray(examDetails.attempts) && (
              <div className="exam-participant-stats">
                <p><strong>Registered:</strong> {examDetails.attempts.filter(a => a.status === 'registered').length}</p>
                <p><strong>In Progress:</strong> {examDetails.attempts.filter(a => a.status === 'in_progress').length}</p>
                <p><strong>Submitted:</strong> {examDetails.attempts.filter(a => a.status === 'submitted' || a.status === 'graded').length}</p>
              </div>
            )}
            {examDetails.instructions && (
              <div className="exam-instructions">
                <h3>Instructions:</h3>
                <p>{examDetails.instructions}</p>
              </div>
            )}
          </div>
          <div className="exam-warning">
            <p>⚠️ Once you start the exam, the timer will begin and cannot be paused.</p>
            <p>⚠️ Make sure you have a stable internet connection.</p>
            <p>⚠️ Do not refresh the page or navigate away during the exam.</p>
          </div>
          <button 
            className="start-exam-btn"
            onClick={handleStartExam}
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = examDetails.questions[currentQuestionIndex];

  return (
    <div className="exam-room">
      <div className="exam-header">
        <h2>{examDetails.title}</h2>
        <div className="exam-timer">
          <span className="timer-label">Time Remaining:</span>
          <span className={`time ${timeLeft <= 300 ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="exam-participants">
          <span>Participants: {Array.isArray(examDetails.attempts) ? examDetails.attempts.length : 0}</span>
          <span>In Progress: {Array.isArray(examDetails.attempts) ? examDetails.attempts.filter(a => a.status === 'in_progress').length : 0}</span>
          <span>Submitted: {Array.isArray(examDetails.attempts) ? examDetails.attempts.filter(a => a.status === 'submitted' || a.status === 'graded').length : 0}</span>
        </div>
      </div>

      <div className="exam-question">
        <div className="question-text">
          <h3>{currentQuestion.question}</h3>
          <span className="question-points">({currentQuestion.points} points)</span>
        </div>

        <div className="question-options">
          {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
            <div className="options-list">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="option-item">
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={option}
                    checked={answers[currentQuestion._id] === option}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'true_false' && (
            <div className="options-list">
              <label className="option-item">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value="true"
                  checked={answers[currentQuestion._id] === 'true'}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                />
                <span className="option-text">True</span>
              </label>
              <label className="option-item">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value="false"
                  checked={answers[currentQuestion._id] === 'false'}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                />
                <span className="option-text">False</span>
              </label>
            </div>
          )}

          {(currentQuestion.type === 'short_answer' || currentQuestion.type === 'essay') && (
            <div className="text-answer">
              <textarea
                value={answers[currentQuestion._id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                placeholder={`Enter your ${currentQuestion.type === 'short_answer' ? 'answer' : 'essay'} here...`}
                rows={currentQuestion.type === 'essay' ? 8 : 3}
                className="answer-textarea"
              />
            </div>
          )}
        </div>
      </div>

      <div className="exam-navigation">
        <button 
          className="nav-btn prev-btn"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        <div className="question-list">
          {examDetails.questions.map((question, index) => (
            <button
              key={question._id}
              className={`question-nav-btn ${currentQuestionIndex === index ? 'active' : ''} ${answers[question._id] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === examDetails.questions.length - 1 ? (
          <button 
            className="nav-btn submit-btn"
            onClick={handleSubmitExam}
          >
            Submit Exam
          </button>
        ) : (
          <button 
            className="nav-btn next-btn"
            onClick={handleNextQuestion}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamRoom;