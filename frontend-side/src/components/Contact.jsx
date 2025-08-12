import React, { useState } from 'react';
import '../stylesFolder/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="section-title">
          <span className="title-icon">📨</span> Contact Us
        </h2>
        
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <h3>Get in Touch</h3>
            
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>+254 793 47 47 47</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div>
                <h4>Email</h4>
                <p>info@smartbusinesskeys.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h4>Location</h4>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
            
            <div className="social-links">
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💼</a>
              <a href="#" className="social-link">💬</a>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="contact-form">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;