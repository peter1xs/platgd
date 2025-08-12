import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import '../stylesFolder/Navbar.css'; 
import CobotLogo from '../assets/cobotLogo.png'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
       <div className="contact-info" id='nav-contact-info'>
          <span className="phone">+254 718 67 12 56</span>
          <span className="email"> info@fusionoops.com</span>
        </div>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to={"/"} className="logo-link">
          <img src={CobotLogo} alt="" className="logo-icon"  style={{width:"120px"}}/>
         </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <a href="#courses" className="nav-link">Courses</a>
          <a href="#faq" className="nav-link">Frequently Asked Questions</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        {/* CTA Button */}
        <div className="navbar-cta">
         
          <a href="#try" className="cta-button">Parent Section</a>
          <Link to="./schoolAuth" className="cta-button">School Section</Link>
          <Link to="./adminDashbord" className='cta-button'>Admin</Link>
          <a href="#try" className="cta-button">Demo Class</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#courses" className="mobile-nav-link" onClick={toggleMobileMenu}>Courses</a>
        <a href="#features" className="mobile-nav-link" onClick={toggleMobileMenu}>Features</a>
        <a href="#about" className="mobile-nav-link" onClick={toggleMobileMenu}>About</a>
        <a href="#contact" className="mobile-nav-link" onClick={toggleMobileMenu}>Contact</a>
       <div>
         <a href="#try" className="mobile-cta" onClick={toggleMobileMenu}>Try Now</a>
       </div>
      </div>
    </nav>
  );
};

export default Navbar;