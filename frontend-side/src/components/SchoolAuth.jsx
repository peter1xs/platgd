import React from 'react'
import '../stylesFolder/SchoolAuth.css'
function SchoolAuth() {
  return (
    <main class="container">
        <section class="login-section">
            <div class="login-container">
                <h2>School Portal Login</h2>
                <p>Enter your school credentials to access the LMS</p>
                
                <form id="schoolLoginForm">
                    <div class="form-group">
                        <label for="schoolCode">School Code</label>
                        <input type="text" id="schoolCode" name="schoolCode" required placeholder="Enter your school code"/>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Enter your password"/>
                    </div>
                    
                    <div class="form-options">
                        <label>
                            {/* <input type="checkbox" name="remember"> Remember me</input> */}
                        </label>
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" class="btn login-btn">Login</button>
                    
                    <div class="register-link">
                        <p>New school? <a href="school-register.html">Register here</a></p>
                    </div>
                </form>
            </div>
            
            <div class="login-info">
                <h3>About School Portal</h3>
                <p>This portal allows registered schools to:</p>
                <ul>
                    <li>Manage student accounts</li>
                    <li>Track learning progress</li>
                    <li>Access teaching resources</li>
                    <li>Generate reports</li>
                </ul>
                <div class="contact-support">
                    <p>Need help? Contact our support team:</p>
                    <a href="mailto:schoolsupport@kenyancodinglms.com">schoolsupport@kenyancodinglms.com</a>
                </div>
            </div>
        </section>
    </main>
  )
}

export default SchoolAuth