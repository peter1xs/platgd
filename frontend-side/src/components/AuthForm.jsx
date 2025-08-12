import React, { useState, useRef, useEffect } from 'react';


const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    signupUsername: '',
    signupEmail: '',
    signupPassword: '',
    signupConfirm: ''
  });
  const containerRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createConfetti();
    // A form submission confirmation
    console.log('Form submitted:', formData);
  };

  const createConfetti = () => {
    const colors = ['#ff9aa2', '#ffb7b2', '#ffdfba', '#b5ead7', '#c7ceea', '#a2d2ff'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = -10 + 'px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 10 + 5 + 'px';
      
      if (containerRef.current) {
        containerRef.current.appendChild(confetti);
        
        const animationDuration = Math.random() * 3 + 2;
        
        confetti.animate([
          { top: '-10px', opacity: 1, transform: `rotate(0deg) translateX(${Math.random() * 100 - 50}px)` },
          { top: '100%', opacity: 0, transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 100 - 50}px)` }
        ], {
          duration: animationDuration * 1000,
          easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)'
        });
        
        setTimeout(() => {
          confetti.remove();
        }, animationDuration * 1000);
      }
    }
  };

  return (
    <div className="container" ref={containerRef}>
      <h1>{activeTab === 'login' ? 'Welcome Back! 👋' : 'Join the Fun! 🎉'}</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'login' ? 'active' : ''}`} 
          onClick={() => handleTabChange('login')}
        >
          Login
        </button>
        <button 
          className={`tab ${activeTab === 'signup' ? 'active' : ''}`} 
          onClick={() => handleTabChange('signup')}
        >
          Sign Up
        </button>
      </div>
      
      <div className="form-container">
        {activeTab === 'login' ? (
          <form className="form login-form active" onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="text" 
                id="login-email" 
                name="loginEmail"
                value={formData.loginEmail}
                onChange={handleInputChange}
                placeholder=" " 
                required 
              />
              <label htmlFor="login-email">Email or Username</label>
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                id="login-password" 
                name="loginPassword"
                value={formData.loginPassword}
                onChange={handleInputChange}
                placeholder=" " 
                required 
              />
              <label htmlFor="login-password">Password</label>
            </div>
            
            <a href="#" className="forgot-password">Forgot Password?</a>
            
            <button type="submit" className="login-btn">Let's Play!</button>
            
            <div className="divider">or continue with</div>
            
            <div className="social-login">
              <div className="social-btn facebook">f</div>
              <div className="social-btn google">G</div>
              <div className="social-btn twitter">t</div>
            </div>
          </form>
        ) : (
          <form className="form signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="text" 
                id="signup-username" 
                name="signupUsername"
                value={formData.signupUsername}
                onChange={handleInputChange}
                placeholder=" " 
                required 
              />
              <label htmlFor="signup-username">Username</label>
            </div>
            
            <div className="input-group">
              <input 
                type="email" 
                id="signup-email" 
                name="signupEmail"
                value={formData.signupEmail}
                onChange={handleInputChange}
                placeholder=" " 
                required 
              />
              <label htmlFor="signup-email">Email</label>
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                id="signup-password" 
                name="signupPassword"
                value={formData.signupPassword}
                onChange={handleInputChange}
                placeholder=" " 
                required 
              />
              <label htmlFor="signup-password">Password</label>
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                id="signup-confirm" 
                name="signupConfirm"
                value={formData.signupConfirm}
                onChange={handleInputChange}
                placeholder=" " 
                required 
              />
              <label htmlFor="signup-confirm">Confirm Password</label>
            </div>
            
            <button type="submit" className="signup-btn">Join the Fun!</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;