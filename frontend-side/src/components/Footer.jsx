import React from 'react';
import '../stylesFolder/Footer.css';
import CobotLogo from '../assets/cobotLogo.png'
const Footer = () => {
  const quickLinks = [
    { name: 'Courses', url: '#courses' },
    { name: 'About Us', url: '#about' },
    { name: 'Pricing', url: '#pricing' },
    { name: 'Tutors Section', url: './tutorLogInAuth' },
    { name: 'Contact', url: '#contact' }
  ];

  const resources = [
    { name: 'Blog', url: '#blog' },
    { name: 'Coding Challenges', url: '#challenges' },
    { name: 'Documentation', url: '#docs' },
    { name: 'Support', url: '#support' },
    { name: 'FAQ', url: '#faq' }
  ];

  const socialMedia = [
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'YouTube', icon: '▶️', url: '#' },
    { name: 'Discord', icon: '💬', url: '#' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
               <img src={CobotLogo} alt="" className="logo-icon"  style={{width:"80px"}}/>
              <span className="logo-text">Cobot Kids Kenya</span>
            </div>
            <p className="footer-mission">
              Making coding fun and accessible for the next generation of innovators.
            </p>
            <div className="footer-social">
              {socialMedia.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="social-link"
                  aria-label={social.name}
                >
                  <span className="social-icon">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="footer-link">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.url} className="footer-link">{resource.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Stay Updated</h3>
            <p className="footer-text">
              Subscribe to our newsletter for coding tips and course updates.
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Your email" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Cobot Kids Kenya. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="#privacy" className="legal-link">Privacy Policy</a>
            <a href="#terms" className="legal-link">Terms of Service</a>
            <a href="#cookies" className="legal-link">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Floating Emojis */}
      <div className="footer-emoji">👩‍💻</div>
      <div className="footer-emoji">👨‍💻</div>
      <div className="footer-emoji">🚀</div>
    </footer>
  );
};

export default Footer;