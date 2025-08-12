import React from 'react';
import styles from './TopNav.module.css';
import { FiLogOut, FiHome, FiUser } from "react-icons/fi";
    

const TopNav = () => {
  return (
  <nav className='top-nav'>
      <header className={styles.topNav}>
      <div className={styles.logo}>AdminPanel</div>
      
      <div className={styles.navRight}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>John Doe</span>
          <div className={styles.avatar}>
            <img src="https://i.pravatar.cc/40" alt="User Avatar" />
          </div>
        </div>
        <button className={styles.logoutButton}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  </nav>
  );
};

export default TopNav;