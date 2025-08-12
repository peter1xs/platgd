import React from "react";
import { Link } from "react-router-dom";
import "./lessons.css";
function HtmlLessonOne() {
  return (
    <>
      <main class="html-notes-container">
        <h2>Lesson 1: Getting Started </h2>
        <article class="html-notes-content">
          {/* <!-- Lesson 1: Getting Started with Scratch --> */}
          <section id="lesson1" class="note-section">
            <h3>Introduction to Coding</h3>

            <div class="key-point">
              <h4>What is a Computer?</h4>
              <p>
                HTML is a fun computer language that lets you make websites,
                games, and animations using blocks.
              </p>
            </div>

            <div class="key-point">
              <h4>Where do we use Computer</h4>
              <ol>
                <li>office </li>
                <li>coding</li>
                <li>home</li>
                <li>school</li>
              </ol>
            </div>

            <div class="key-point">
              <h4>Understanding Computer Shotcuts and Tabs</h4>
              <ol>
                <li>Crtl + T = Open a new Tab </li>
                <li>Crtl + c = Copy</li>
                <li>Crtl + v = Paste</li>
                <li>Crtl + w = Close a Tab</li>
              </ol>
            </div>

            <div class="key-point">
              <h4>Coding Story time</h4>
              <p>
                {" "}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
                culpa expedita aut quos, voluptatum ut numquam facilis cum illo
                laudantium nostrum vitae maxime ratione exercitationem officiis
                error rem necessitatibus. Voluptas. t, a mollitia reiciendis
                sequi itaque aliquam? Fugit quos, temporibus laudantium laborum
                in nobis dolore assumenda ut porro itaque praesentium qui,
                aspernatur soluta illum nostrum, nesciunt minima dolorem
                voluptate accusamus. Ratione alias non nisi quasi id illum odit
                nobis tempora error? Nobis, ut? Deserunt nam consectetur
                corrupti perspiciatis aliquam impedit! Odit repudiandae amet
                provident. Sequi quasi iste ipsa distinctio consectetur!
              </p>
            </div>

            <div class="key-point">
              <h4>Question Time</h4>
              <ol>
                <li>What is Coding? </li>
                <li>Give out some of the coding language</li>
                <li>Why computer need instructions</li>
              </ol>
            </div>

            <div class="activity">
              <h4>Activity</h4>
              <div class="activity-step">
                <h5>Two volunteers ......</h5>
                <ol>
                  <li>
                    Come infront of the <strong>Class</strong>
                  </li>
                  <li>
                    Pick any <strong>language</strong> of their choice
                  </li>
                  <li>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, culpa expedita aut quos, voluptatum ut numquam
                      facilis cum illo pti perspiciatis aliquam impedit! Odit
                      repudiandae amet provident. Sequi quasi iste ipsa
                      distinctio consectetur!
                    </p>
                  </li>
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
  );
}

export default HtmlLessonOne;
