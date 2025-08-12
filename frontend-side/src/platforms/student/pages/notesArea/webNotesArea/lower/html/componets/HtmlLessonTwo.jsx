import React from "react";
import { Link } from "react-router-dom";
function HtmlLessonTwo() {
  return (
    <>
      <main class="html-notes-container">
        <h2>Lesson 2: Getting Started with Hyper Text Mark-Up Language</h2>
        <article class="html-notes-content">
          {/* <!-- Lesson 1: Getting Started with Scratch --> */}
          <section id="lesson1" class="note-section">
            <h3>Introduction to HTML basics</h3>

            <div class="key-point">
              <h4>What is HTML?</h4>
              <p>
                HTML is a fun computer language that lets you make websites,
                games, and animations using blocks.
              </p>
            </div>

            <div class="key-point">
              <h4>HTML Facts</h4>
              <ol>
                <li>Created by Tim</li>
                <li>Uses tag like </li>
                <li>HTML can works together with Css and Javascript</li>
                <li>Easy to learn- its like maths just adding 1+1=2 simple</li>
              </ol>
            </div>

            <div class="key-point">
              <h4>HTML symbols </h4>
              <ol>
                <li> --------- open angular bracket</li>
                <li> --------- closing angular bracket </li>
                <li>/ -------- Forward slash</li>
              </ol>

              <h4>How to create HTML tags</h4>
              <ol>
                <li> --------- open tag</li>
                <li> --------- closing tag </li>
              </ol>
              <h4>Types of Html tags </h4>
              <ol>
                <li> --------- Container tag</li>
                <li> --------- self-closing tag </li>
              </ol>
              <div class="interactive-demo">
                            <h4>Your Turn to Try!</h4>
                            <div class="demo-container">
                                <div class="code-editor">
                                    <div class="editor-header">Playground</div>
                                    <textarea class="editor-body" placeholder="Try here"></textarea>
                                    
                                </div>
                                
                            </div>
                        </div>
            </div>

            <div class="key-point">
              <h4>Headings</h4>
              <ul>
                <li>Headings a are used to give titles or subtitles </li>
                <li>In coding computer understand heading as h</li>
              </ul>

               <div class="key-point">
              <h4>HTML has 6 headings levels</h4>
              <ul>
                <li> h1</li>
                <li> h2</li>
                <li> h3</li>
                <li> h4</li>
                <li> h4</li>
                <li> h5</li>
                <li> h6</li>
                
              </ul>
            </div>
            </div>            
          </section>

        </article>
         {/* <!-- Navigation Links --> */}
          <div class="practice-room-btn">
            <Link to="/webcodingpage" class="nav-btn">
              Go To Practise <i class="fas fa-arrow-right"></i>
            </Link>
          </div>
      </main>
    </>
  );
}

export default HtmlLessonTwo;
