import React, { useState } from 'react';
import '../stylesFolder/AnimatedLoginForm.css';
import { useNavigate, Link } from 'react-router-dom';

const AnimatedLoginForm = () => {

  const [isFocused, setIsFocused] = useState({
    userName: false,
    password: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const [alert, setAlert]=useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate("")
      }, 3000);
    }, 2000);
  };

  return (
    <div className="student-login-container">
      <div className="student-login-animation">
        <div className="floating-shapes">
          <div className="shape triangle"></div>
          <div className="shape circle"></div>
          <div className="shape square"></div>
        </div>
        <div className="character">
          <div className="head">
            <div className="eyes">
              <div className={`eye left ${isFocused.email || isFocused.password ? 'focused' : ''}`}>
                
              </div>
              <div className={`eye right ${isFocused.email || isFocused.password ? 'focused' : ''}`}></div>
            </div>
            <div className={`mouth ${isSubmitting ? 'talking' : showSuccess ? 'happy' : ''}`}></div>
          </div>
          <div className="body"></div>
          <div className="arm left"></div>
          <div className="arm right"></div>
        </div>

        <div className="character">
          <div className="head">
            <div className="eyes">
              <div className={`eye left ${isFocused.email || isFocused.password ? 'focused' : ''}`}>
                
              </div>
              <div className={`eye right ${isFocused.email || isFocused.password ? 'focused' : ''}`}></div>
            </div>
            <div className={`mouth ${isSubmitting ? 'talking' : showSuccess ? 'happy' : ''}`}></div>
          </div>
          <div className="body"></div>
          <div className="arm left"></div>
          <div className="arm right"></div>
        </div>

        
      </div>

    

      <div className="login-form">
        <h2>Welcome Back!</h2>
        <p className="subtitle">Please login to continue</p>

        <form onSubmit={handleSubmit}>
          <div className={`form-group `}>
            <label htmlFor="userName">UserName</label>
            <input
              type="text"
              id="email"
              name="userName"
              
              onChange={handleChange}
              
              required
            />
            <div className="underline"></div>
          </div>

          <div className={`form-group ${isFocused.password ? 'focused' : ''}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              required
            />
            <div className="underline"></div>
          </div>

          <div className="form-options">
            <a href="#forgot" className="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              <span>Go To School</span>
            )}
          </button>

          {showSuccess && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              Login successful! Redirecting...
            </div>
          )}
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/tutorcreate">Ask Teacher For Your Account</Link>
        </div>
      </div>
    </div>
  );
};

export default AnimatedLoginForm;