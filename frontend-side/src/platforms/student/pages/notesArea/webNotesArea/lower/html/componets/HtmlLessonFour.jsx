import React from 'react'
import { Link } from 'react-router-dom'
function HtmlLessonFour() {
  return (
     <>
      <main class="html-notes-container">
        <h2>Lesson 2: Getting Started with Hyper Text Mark-Up Language</h2>
        <article class="html-notes-content">
          {/* <!-- Lesson 1: Getting Started with Scratch --> */}
          <section id="lesson1" class="note-section">
            <h3>Paragraphs & Text Formatting</h3>

            <div class="key-point">
              <h4>What is a Paragraph?</h4>
              <p>
                HTML is a fun computer language that lets you make websites,
                games, and animations using blocks.
              </p>

              <div>
                <h4>How computer Understand Paragraph</h4>
                <p>
                  HTML is a fun computer language that lets you make websites,
                  games, and animations using blocks.
                </p>
              </div>
            </div>

            <div class="key-point">
              <h4>What is Text formatting?</h4>
              <p>
                HTML is a fun computer language that lets you make websites,
                games, and animations using blocks.
              </p>
              <div class="key-point">
                <h4>Example of Text Formatting</h4>
                <ol>
                  <li> Marquee</li>
                  <li> Mark</li>
                  <li>Italics</li>
                </ol>
              </div>
            </div>
          </section>
        </article>
        {/* <!-- Navigation Links --> */}
        <div class="practice-room-btn">
          <Link to="/lesson3" class="nav-btn">
            Go To Practise <i class="fas fa-arrow-right"></i>
          </Link>
        </div>
      </main>
    </>
  )
}

export default HtmlLessonFour