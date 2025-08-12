import React, { useState } from 'react';
import '../stylesFolder/WhyChooseUs.css';

const WhyChooseUs = () => {
  const [activeCard, setActiveCard] = useState(null);

  const features = [
    {
      icon: '🎮',
      title: 'Game-Based Learning',
      description: 'Our courses feel like playing a game, with levels, achievements, and instant feedback to keep kids engaged.',
      color: '#6C4DF6'
    },
    {
      icon: '👩‍💻',
      title: 'Real Coding Skills',
      description: 'We teach actual programming languages (Python, JavaScript) used by professionals, not just block coding.',
      color: '#FF7E33'
    },
    {
      icon: '🔒',
      title: 'Safe Environment',
      description: '100% kid-friendly platform with no ads, no data collection, and moderated community features.',
      color: '#00E0C7'
    },
    {
      icon: '🌎',
      title: 'Global Community',
      description: 'Join thousands of young coders worldwide in challenges, competitions, and collaborative projects.',
      color: '#FFBD2E'
    }
  ];

  return (
    <section id="why-choose-us" className="why-choose-us-section">
      <div className="why-choose-us-container">
        <h2 className="section-title">
          <span className="title-icon">🌟</span> Why Choose CodeForKids?
        </h2>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card ${activeCard === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              style={{
                '--card-color': feature.color,
                transform: activeCard === index ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <div className="card-icon" style={{ backgroundColor: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
              <div className="card-highlight" style={{ backgroundColor: feature.color }}></div>
            </div>
          ))}
        </div>
        
        <div className="testimonials">
          <h3 className="testimonials-title">What Our Students Say</h3>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "I built my first game after just 2 weeks! Never thought coding could be this fun."
              </div>
              <div className="testimonial-author">
                <span className="author-emoji">👦</span>
                <span className="author-name">Jamie, 12</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                "As a teacher, I love how CodeForKids makes complex concepts simple and engaging."
              </div>
              <div className="testimonial-author">
                <span className="author-emoji">👩‍🏫</span>
                <span className="author-name">Ms. Rodriguez</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                "My daughter went from zero to building her own website in a month. Amazing progress!"
              </div>
              <div className="testimonial-author">
                <span className="author-emoji">👩‍👧</span>
                <span className="author-name">Sarah's Mom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;