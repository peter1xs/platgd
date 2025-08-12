import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLogOut, FiHome, FiBook, FiChevronDown, FiUsers, FiClipboard, FiUserCheck, FiKey, FiFileText } from "react-icons/fi";

import styles from './SideBar.module.css';

const Sidebar = () => {
  const location = useLocation();
  const [schoolsOpen, setSchoolsOpen] = useState(false);

  return (
    <aside className={styles.sidebar} >
      <nav className={styles.nav}>
        <Link 
          to="/dashboard" 
          className={`${styles.menuItem} ${location.pathname === '/dashboard' ? styles.active : ''}`}
        >
          <FiHome className={styles.icon} />
          <span>Dashboard</span>
        </Link>

         <Link 
          to="/schoolsPage" 
          className={`${styles.menuItem} ${location.pathname === '/schoolsPage' ? styles.active : ''}`}
        >
          <FiHome className={styles.icon} />
          <span>Schools</span>
        </Link>

        <Link 
          to="/coursePage" 
          className={`${styles.menuItem} ${location.pathname === '/coursePage' ? styles.active : ''}`}
        >
          <FiBook className={styles.icon} />
          <span>Courses</span>
        </Link>

        <Link 
          to="/tutorsPage" 
          className={`${styles.menuItem} ${location.pathname === '/tutorsPage' ? styles.active : ''}`}
        >
          <FiUsers className={styles.icon} />
          <span>Tutors</span>
        </Link>
        
        <Link 
          to="/examsPage" 
          className={`${styles.menuItem} ${location.pathname === '/examsPage' ? styles.active : ''}`}
        >
          <FiClipboard className={styles.icon} />
          <span>Exams</span>
        </Link>

        <Link 
          to="/assignments" 
          className={`${styles.menuItem} ${location.pathname === '/assignments' ? styles.active : ''}`}
        >
          <FiFileText className={styles.icon} />
          <span>Assignments</span>
        </Link>

        <Link 
          to="/tutorAssignments" 
          className={`${styles.menuItem} ${location.pathname === '/tutorAssignments' ? styles.active : ''}`}
        >
          <FiUserCheck className={styles.icon} />
          <span>Assign Tutors</span>
        </Link>

        <Link 
          to="/classCodes" 
          className={`${styles.menuItem} ${location.pathname === '/classCodes' ? styles.active : ''}`}
        >
          <FiKey className={styles.icon} />
          <span>Class Codes</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;