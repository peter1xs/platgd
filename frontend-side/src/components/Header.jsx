import React from 'react'
import FloatingCode from './FloatingCode';
import { Link } from 'react-router-dom';
import "../stylesFolder/Header.css"


function Header() {
  const codeSnippets = [
    "print('Hello World!')",
    "function hack() { }",
    "while True: learn()",
    "if (awesome) { keepCoding(); }"
  ];

  return (
    <header className="header">
      {codeSnippets.map((code, index) => (
        <FloatingCode
          key={index}
          code={code}
          top={Math.random() * 90}
          left={Math.random() * 90}
        />
      ))}

      <div className="header-section">
        <div className="hero-text">
          <h1>Cobot Kids Kenya</h1>
          <p className="tagline">Empowering Young Minds With Tech</p>
          <p className='sub-tagline'> Join thousands of kids learning to code by creating games, animations,
            and interactive stories! Our playful approach makes programming
            concepts easy and exciting to learn.</p>
          <div>
            <Link to={"studentauth"} className="cta-button">Go To Class</Link>
          </div>
          
          
        </div>
        <div class="hero-image">
            <img src="https://varthana.com/school/wp-content/uploads/2023/02/B193.jpg"
              alt="Kids learning to code together"
              class="main-image" />

              <img src="https://varthana.com/school/wp-content/uploads/2023/02/B193.jpg"
              alt="Kids learning to code together"
              class="main-image" />
              <img src="https://varthana.com/school/wp-content/uploads/2023/02/B193.jpg"
              alt="Kids learning to code together"
              class="main-image" />
          </div>
      </div>
    </header>
  )
}

export default Header