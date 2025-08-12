import React from 'react'
import {Link} from 'react-router-dom'
import '../stylesFolder/SideBar.css'
function SideBar() {
  return (
    //  <!-- Sidebar Navigation -->
        <div class="sidebar">
            <div class="sidebar-header">
                <h2><i class="fas fa-chalkboard-teacher"></i> Teacher Dashboard</h2>
            </div>
            <ul class="sidebar-menu">
                <li><Link><i class="fas fa-users"></i> My Schools</Link></li>
                <li><Link><i class="fas fa-users"></i> Exam Room</Link></li>
                <li><Link><i class="fas fa-users"></i>Assignments</Link></li>
                <li><Link><i class="fas fa-users"></i>Projects</Link></li>
                <li><Link><i class="fas fa-users"></i>  My  Performance</Link></li>
                <li><Link><i class="fas fa-users"></i>Resources</Link></li>
                <li><Link><i class="fas fa-users"></i>Class Code</Link></li>
                <li><Link><i class="fas fa-users"></i>Create Class</Link></li>
            </ul>
        </div>
  )
}

export default SideBar