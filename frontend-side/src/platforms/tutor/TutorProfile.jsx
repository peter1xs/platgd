import React from 'react'

function TutorProfile() {
  return (
   <div class="profile-card">
            <div className="profile-info">
                <div class="profile-pic">
                    <i class="fas fa-user-astronaut profile-icon"></i>
                    <div class="upload-indicator">
                        <i class="fas fa-camera"></i>
                    </div>
                    <div class="profile-text">Add Photo</div>
                </div>
                <div className="profile-info-text">
                    <h1>Fredrick Othiamblo</h1>
                    <h5>Tutor</h5>
                    <p>No bio Available. Update your profile to add a bio</p>
                    <div class="profile-stats">
                        <span class="stat-label"> 250 Points</span>
                        <span class="stat-label"> 25k Followers</span>
                        <span class="stat-label">Joined 5/29/2025</span>
                        <span class="stat-label">0% Attendance</span>

                    </div>
                </div>

            </div>
            
        </div>
  )
}

export default TutorProfile